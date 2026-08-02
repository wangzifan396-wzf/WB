
const fs=require('fs');
const html=fs.readFileSync(__dirname+'/index.html','utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
if(!m){ console.error('no core script'); process.exit(1); }
const P=new Function(m[1]+'\n;return SbomForgePure();')();
const assert=require('assert');

// ============ purl 官方测试套件向量 ============
var a=P.parsePurl('pkg:maven/org.apache.commons/io@1.3.4');
assert.strictEqual(a.type,'maven'); assert.strictEqual(a.namespace,'org.apache.commons');
assert.strictEqual(a.name,'io'); assert.strictEqual(a.version,'1.3.4');

var b=P.parsePurl('pkg:npm/%40angular/animation@12.3.1');
assert.strictEqual(b.namespace,'@angular','npm scoped namespace decoded');
assert.strictEqual(b.name,'animation'); assert.strictEqual(b.version,'12.3.1');

var c=P.parsePurl('pkg:golang/google.golang.org/genproto#googleapis/api/annotations');
assert.strictEqual(c.namespace,'google.golang.org'); assert.strictEqual(c.name,'genproto');
assert.strictEqual(c.subpath,'googleapis/api/annotations','subpath parsed');
assert.strictEqual(c.version,'','no version');

var d=P.parsePurl('pkg:deb/debian/curl@7.50.3-1?arch=i386&distro=jessie');
assert.strictEqual(d.qualifiers.arch,'i386'); assert.strictEqual(d.qualifiers.distro,'jessie');
assert.strictEqual(d.version,'7.50.3-1');

var e=P.parsePurl('pkg:docker/customer/dockerimage@sha256:244fd47e07d10?repository_url=gcr.io');
assert.strictEqual(e.version,'sha256:244fd47e07d10','docker digest version keeps colon');
assert.strictEqual(e.qualifiers.repository_url,'gcr.io');

// 类型专属规范化：PyPI 名称小写 + 下划线转连字符
var f=P.normalizePurl('pkg:PyPI/Django_package@1.11.1');
assert.strictEqual(f.type,'pypi'); assert.strictEqual(f.name,'django-package');
assert.strictEqual(f.canonical,'pkg:pypi/django-package@1.11.1','pypi canonical');
// GitHub：namespace 与 name 都小写
var g=P.normalizePurl('pkg:GitHub/Package-url/purl-Spec@244fd47e07d1004');
assert.strictEqual(g.canonical,'pkg:github/package-url/purl-spec@244fd47e07d1004','github canonical');
// 无 namespace
var h=P.parsePurl('pkg:gem/ruby-advisory-db-check@0.12.4');
assert.strictEqual(h.namespace,''); assert.strictEqual(h.name,'ruby-advisory-db-check');

// 往返：解析 -> 重建
var rt=P.buildPurl(P.parsePurl('pkg:maven/org.apache.commons/io@1.3.4'));
assert.strictEqual(rt.purl,'pkg:maven/org.apache.commons/io@1.3.4','maven roundtrip');
var rt2=P.buildPurl(P.parsePurl('pkg:npm/%40angular/animation@12.3.1'));
assert.strictEqual(rt2.purl,'pkg:npm/%40angular/animation@12.3.1','npm scoped roundtrip');
// 限定符按字典序排序
var rt3=P.buildPurl({type:'deb',namespace:'debian',name:'curl',version:'7.50.3-1',
                     qualifiers:{distro:'jessie',arch:'i386'}});
assert.strictEqual(rt3.purl,'pkg:deb/debian/curl@7.50.3-1?arch=i386&distro=jessie','qualifiers sorted');
// 空限定符值被丢弃
assert.strictEqual(P.parsePurl('pkg:npm/foo@1.0?arch=').qualifiers.arch, undefined, 'empty qualifier dropped');

// purl 错误处理
assert.ok(P.parsePurl('').error,'empty');
assert.ok(P.parsePurl('npm/foo@1.0').error,'missing pkg scheme');
assert.ok(P.parsePurl('http://example.com/foo').error,'wrong scheme');
assert.ok(P.parsePurl('pkg:npm').error,'missing name');

// ============ CycloneDX ============
var cdx={bomFormat:'CycloneDX',specVersion:'1.5',
  metadata:{component:{type:'application',name:'svc',version:'1.0','bom-ref':'root'}},
  components:[
    {type:'library','bom-ref':'pkg:npm/express@4.18.2',name:'express',version:'4.18.2',
     purl:'pkg:npm/express@4.18.2',licenses:[{license:{id:'MIT'}}],hashes:[{alg:'SHA-256',content:'aa'}]},
    {type:'library','bom-ref':'no-version',name:'mystery'}
  ],
  dependencies:[{ref:'root',dependsOn:['pkg:npm/express@4.18.2','ghost-ref']}]};
var r1=P.analyze(JSON.stringify(cdx));
assert.strictEqual(r1.format,'CycloneDX'); assert.strictEqual(r1.spec,'1.5');
assert.strictEqual(r1.components.length,2,'2 components');
assert.strictEqual(r1.subject,'svc@1.0','metadata subject');
assert.strictEqual(r1.deps.length,2,'2 dep edges');
var txt=r1.issues.map(function(x){return x.text;}).join('|');
assert.ok(/缺少版本号/.test(txt),'missing version flagged');
assert.ok(/不存在的组件/.test(txt),'dangling ref flagged');
assert.ok(r1.errCount>=2,'errors counted, got '+r1.errCount);
// 嵌套 components 也要被展开
var nested={bomFormat:'CycloneDX',specVersion:'1.4',components:[
  {name:'a',version:'1',purl:'pkg:npm/a@1',components:[{name:'b',version:'2',purl:'pkg:npm/b@2'}]}]};
assert.strictEqual(P.analyze(JSON.stringify(nested)).components.length,2,'nested flattened');

// ============ SPDX ============
var spdx={spdxVersion:'SPDX-2.3',SPDXID:'SPDXRef-DOCUMENT',name:'doc',
  packages:[{SPDXID:'SPDXRef-a',name:'express',versionInfo:'4.18.2',
    licenseConcluded:'MIT',licenseDeclared:'MIT',
    externalRefs:[{referenceType:'purl',referenceLocator:'pkg:npm/express@4.18.2'}],
    checksums:[{algorithm:'SHA256',checksumValue:'aa'}]},
   {SPDXID:'SPDXRef-b',name:'mystery',licenseConcluded:'NOASSERTION',licenseDeclared:'NOASSERTION'}],
  relationships:[{spdxElementId:'SPDXRef-a',relationshipType:'DEPENDS_ON',relatedSpdxElement:'SPDXRef-b'}]};
var r2=P.analyze(JSON.stringify(spdx));
assert.strictEqual(r2.format,'SPDX'); assert.strictEqual(r2.components.length,2);
assert.strictEqual(r2.components[0].purl,'pkg:npm/express@4.18.2','spdx purl from externalRefs');
assert.deepStrictEqual(r2.components[1].licenses,[],'NOASSERTION not counted as license');
assert.strictEqual(r2.deps.length,1,'DEPENDS_ON edge');

// 统计
var st=r1.stats;
assert.ok(st.licenses.length>=1,'license histogram');
assert.ok(st.types.some(function(t){return t.k==='npm';}),'npm type counted');

// 格式识别 / 错误
assert.ok(P.analyze('').error,'empty sbom');
assert.ok(P.analyze('{').error,'bad json');
assert.ok(P.analyze('{"foo":1}').error,'unknown format');
assert.strictEqual(P.detectFormat({spdxVersion:'SPDX-2.3'}),'spdx');
assert.strictEqual(P.detectFormat({bomFormat:'CycloneDX'}),'cyclonedx');

console.log('PASS sbom 8/0');
