
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=/<script>([\s\S]*?)<\/script>/.exec(html);
const mod={exports:{}};
new Function('module','exports','require', m[1])(mod,mod.exports,require);
const P=mod.exports;
let pass=0,fail=0;
function ok(c,msg){ if(c){pass++;} else {fail++; console.error('FAIL: '+msg);} }
function eq(a,b,msg){ ok(a===b, msg+' (got '+JSON.stringify(a)+', want '+JSON.stringify(b)+')'); }

// ================= RFC 7638 附录 A.1 官方向量 =================
const RFC7638_N='0vx7agoebGcQSuuPiLJXZptN9nndrQmbXEps2aiAFbWhM78LhWx4cbbfAAtVT86zwu1RK7aPFFxuhDR1L6tSoc_BJECPebWKRXjBZCiFV4n3oknjhMstn64tZ_2W-5JsGY4Hc5n9yBXArwl93lqt7_RN5w6Cf0h4QyQ5v-65YGjQR0_FDW2QvzqY368QQMicAtaSqzs8KJZgnYb9c7d0zgdAZHzu6qMQvRL5hajrn1n91CbOpbISD08qNLyrdkt-bFTWhAI4vMQFh6WeZu0fM4lFd2NcRwr3XPksINHaQ-G_xBniIqbw0Ls1jF44-csFCur-kEgU8awapJzKnqDKgw';
const rsaJwk={kty:'RSA', n:RFC7638_N, e:'AQAB', alg:'RS256', kid:'2011-04-29'};
var tp=P.thumbprint(rsaJwk);
eq(tp.value,'NzbLsXh8uDCcd-6MNwXF4W_7noWXFZAfHkxZsRGC9Xs','RFC 7638 A.1 RSA 指纹与官方一致');
eq(tp.canonical,'{"e":"AQAB","kty":"RSA","n":"'+RFC7638_N+'"}','规范化 JSON 只留三个成员且按字典序');
eq(P.keyBits(rsaJwk),2048,'RSA 位数');

// ================= RFC 8037 附录 A.3 官方向量 =================
const okp={kty:'OKP', crv:'Ed25519', x:'11qYAYKxCrfVS_7TyWQHOg7hcvPapiMlrwIaaPcHURo'};
eq(P.thumbprint(okp).value,'kPrK_qmxVWaYVA9wwBF6Iuo3vVzz7TxHCTwXBygrS4k','RFC 8037 A.3 Ed25519 指纹与官方一致');
eq(P.thumbprint(okp).canonical,'{"crv":"Ed25519","kty":"OKP","x":"11qYAYKxCrfVS_7TyWQHOg7hcvPapiMlrwIaaPcHURo"}','OKP 规范化 JSON');
eq(P.thumbprint({kty:'oct',k:'AQ'}).canonical,'{"k":"AQ","kty":"oct"}','oct 规范化 JSON');
ok(P.thumbprint({kty:'RSA',e:'AQAB'}).error.indexOf('缺少必需成员 "n"')>=0,'缺成员时拒绝算指纹');
ok(P.thumbprint({kty:'XYZ'}).error.indexOf('不支持的 kty')>=0,'未知 kty 拒绝算指纹');

// ================= DER 已知前缀 =================
// Ed25519 SPKI 的固定头：SEQUENCE{ SEQUENCE{ OID 1.3.101.112 }, BIT STRING }
var spki=P.jwkToSpki(okp);
eq(P.toHex(spki.value).slice(0,24),'302a300506032b6570032100','Ed25519 SPKI 头字节与 RFC 8410 一致');
eq(spki.value.length,44,'Ed25519 SPKI 共 44 字节');
eq(P.spkiToJwk(spki.value).value.x, okp.x,'Ed25519 SPKI 往返回到同一个 x');
eq(P.spkiToJwk(spki.value).value.crv,'Ed25519','曲线名还原');

// Ed25519 PKCS#8 固定头
var okpPriv={kty:'OKP', crv:'Ed25519', x:okp.x, d:'nWGxne_9WmC6hEr0kuwsxERJxWl7MmkZcDusAxyuf2A'};
var p8=P.jwkToPkcs8(okpPriv);
eq(P.toHex(p8.value).slice(0,32),'302e020100300506032b657004220420','Ed25519 PKCS#8 头字节与 RFC 8410 一致');
eq(p8.value.length,48,'Ed25519 PKCS#8 共 48 字节');
eq(P.pkcs8ToJwk(p8.value).value.d, okpPriv.d,'Ed25519 PKCS#8 往返回到同一个 d');

// P-256 SPKI 固定头
function b64u(bytes){ return P.b64url(bytes); }
function seq(n,v){ var a=[]; for(var i=0;i<n;i++) a.push(v); return a; }
var ecJwk={kty:'EC', crv:'P-256', x:b64u(seq(32,0x11)), y:b64u(seq(32,0x22))};
var ecSpki=P.jwkToSpki(ecJwk);
eq(P.toHex(ecSpki.value).slice(0,52),'3059301306072a8648ce3d020106082a8648ce3d030107034200','P-256 SPKI 头字节与 RFC 5480 一致');
eq(ecSpki.value.length,91,'P-256 SPKI 共 91 字节');
var ecBack=P.spkiToJwk(ecSpki.value).value;
eq(ecBack.crv,'P-256','EC 曲线还原');
eq(ecBack.x,ecJwk.x,'EC x 往返');
eq(ecBack.y,ecJwk.y,'EC y 往返');

// EC 私钥往返
var ecPriv={kty:'EC', crv:'P-256', x:ecJwk.x, y:ecJwk.y, d:b64u(seq(32,0x33))};
var ecP8=P.jwkToPkcs8(ecPriv);
var ecP8Back=P.pkcs8ToJwk(ecP8.value).value;
eq(ecP8Back.d,ecPriv.d,'EC PKCS#8 私钥往返');
eq(ecP8Back.x,ecPriv.x,'EC PKCS#8 顺带带回公钥 x');
eq(ecP8Back.crv,'P-256','EC PKCS#8 曲线');

// RSA 往返
var rsaSpki=P.jwkToSpki(rsaJwk);
eq(P.toHex(rsaSpki.value).slice(0,38),'30820122300d06092a864886f70d0101010500','2048 位 RSA SPKI 的 AlgorithmIdentifier 与 RFC 8017 一致');
// SPKI 外层 len 0x0122=290 = AlgId 15 字节 + BIT STRING TLV 275 字节
eq(P.toHex(rsaSpki.value).slice(38,48),'0382010f00','RSA SPKI 的 BIT STRING 头与 0 个 unused bit');
eq(rsaSpki.value.length,4+290,'RSA SPKI 总长自洽');
var rsaBack=P.spkiToJwk(rsaSpki.value).value;
eq(rsaBack.n,rsaJwk.n,'RSA n 往返');
eq(rsaBack.e,'AQAB','RSA e 往返');
eq(P.thumbprint(rsaBack).value,'NzbLsXh8uDCcd-6MNwXF4W_7noWXFZAfHkxZsRGC9Xs','往返后指纹不变');

// PEM 包裹
var pem=P.jwkToPem(okp,false);
ok(pem.value.indexOf('-----BEGIN PUBLIC KEY-----')===0,'PEM 头');
ok(pem.value.indexOf('-----END PUBLIC KEY-----')>0,'PEM 尾');
ok(pem.value.split('\n')[1].length<=64,'PEM 每行不超过 64 列');
eq(P.pemToJwk(pem.value).value.x, okp.x,'PEM → JWK 往返');
eq(P.pemToJwk(P.jwkToPem(okpPriv,true).value).value.d, okpPriv.d,'私钥 PEM 往返');

// ---- 错误路径 ----
ok(P.pemToJwk('-----BEGIN RSA PRIVATE KEY-----\nAQAB\n-----END RSA PRIVATE KEY-----').error.indexOf('PKCS#1')>=0,'PKCS#1 私钥给出转换指引');
ok(P.pemToJwk('-----BEGIN EC PRIVATE KEY-----\nAQAB\n-----END EC PRIVATE KEY-----').error.indexOf('SEC1')>=0,'SEC1 私钥给出转换指引');
ok(P.pemToJwk('-----BEGIN CERTIFICATE-----\nAQAB\n-----END CERTIFICATE-----').error.indexOf('证书')>=0,'证书不是裸公钥');
ok(P.pemToJwk('-----BEGIN ENCRYPTED PRIVATE KEY-----\nAQAB\n-----END ENCRYPTED PRIVATE KEY-----').error.indexOf('口令')>=0,'加密私钥说明需先解密');
ok(P.pemToJwk('随便一段文字').error.indexOf('PEM 头尾')>=0,'非 PEM 输入');
ok(P.spkiToJwk([0x02,0x01,0x00]).error.indexOf('不像 SPKI')>=0,'非 SEQUENCE 拒绝');
ok(P.pkcs8ToJwk([0x02,0x01,0x00]).error.indexOf('不像 PKCS#8')>=0,'非 SEQUENCE 拒绝 PKCS8');
ok(P.jwkToSpki({kty:'oct',k:'AQ'}).error.indexOf('对称密钥')>=0,'oct 无 SPKI');
ok(P.jwkToSpki({kty:'EC',crv:'P-999',x:'AA',y:'AA'}).error.indexOf('不认识的 EC 曲线')>=0,'未知曲线');
ok(P.jwkToPkcs8(okp).error.indexOf('这是公钥')>=0,'公钥导不出 PKCS8');
ok(P.jwkToPkcs8({kty:'RSA',n:'AQ',e:'AQAB',d:'AQ'}).error.indexOf('CRT 参数')>=0,'RSA 私钥缺 CRT 参数');

// ---- base64url 合法性 ----
eq(P.b64uProblem('abc'),null,'合法 base64url');
ok(P.b64uProblem('ab=')!==null,'带 padding 被拒');
ok(P.b64uProblem('a+b').indexOf('+ 或 /')>=0,'标准 base64 字符被拒');
ok(P.b64uProblem('a').indexOf('取模为 1')>=0,'非法长度被拒');
ok(P.b64uProblem('').indexOf('空串')>=0,'空串被拒');

// ---- lintKey ----
function L(j){ return P.lintKey(j).map(function(i){ return i.level+':'+i.msg; }).join('\n'); }
ok(L({}).indexOf('缺少 kty')>=0,'缺 kty');
ok(L({kty:'RSA',e:'AQAB'}).indexOf('缺少必需成员 n')>=0,'缺 n');
ok(L({kty:'RSA',n:RFC7638_N,e:'AQAB',d:'AQAB'}).indexOf('挂到了公网')>=0,'私钥泄漏被判 bad');
ok(L({kty:'RSA',n:RFC7638_N,e:'AQAB'}).indexOf('没有 kid')>=0,'缺 kid 提醒');
ok(L({kty:'RSA',n:RFC7638_N,e:'AQ',kid:'x'}).indexOf('不是常规的 AQAB')>=0,'异常 e');
ok(L({kty:'RSA',n:'AQAB',e:'AQAB',kid:'x'}).indexOf('低于 2048 位下限')>=0,'短 RSA');
ok(L({kty:'EC',crv:'P-256',x:'AQAB',y:'AQAB',kid:'x'}).indexOf('左补零到固定长度')>=0,'EC 坐标长度不足');
ok(L({kty:'EC',crv:'secp256k1',x:b64u(seq(32,1)),y:b64u(seq(32,2)),kid:'x'}).indexOf('ES256K')>=0,'secp256k1 提示');
ok(L({kty:'OKP',crv:'Ed25519',x:'AQAB',kid:'x'}).indexOf('应为 32 字节')>=0,'Ed25519 x 长度');
ok(L({kty:'oct',k:b64u(seq(16,1)),kid:'x'}).indexOf('至少 256 位')>=0,'短对称密钥');
ok(L({kty:'EC',crv:'P-256',x:b64u(seq(32,1)),y:b64u(seq(32,2)),alg:'RS256',kid:'x'}).indexOf('不匹配')>=0,'alg 与 kty 不匹配');
ok(L({kty:'EC',crv:'P-256',x:b64u(seq(32,1)),y:b64u(seq(32,2)),alg:'ES256',kid:'x'}).indexOf('不匹配')<0,'alg 匹配时不报错');
ok(L({kty:'RSA',n:RFC7638_N,e:'AQAB',alg:'PS512',kid:'x'}).indexOf('不匹配')<0,'RSA 允许 PS 系列');
ok(L({kty:'RSA',n:RFC7638_N,e:'AQAB',kid:'x',use:'sig',key_ops:['verify']}).indexOf('只留一个')>=0,'use 与 key_ops 并存');
ok(L({kty:'RSA',n:RFC7638_N,e:'AQAB',kid:'x',use:'whatever'}).indexOf('不是注册值')>=0,'非法 use');
ok(L({kty:'RSA',n:RFC7638_N,e:'AQAB',kid:'NzbLsXh8uDCcd-6MNwXF4W_7noWXFZAfHkxZsRGC9Xs'}).indexOf('天然不撞车')>=0,'kid 用指纹被肯定');
ok(L({kty:'RSA',n:RFC7638_N,e:'AQAB',kid:'other'}).indexOf('用指纹当 kid 更省心')>=0,'kid 非指纹时给建议');
ok(L({kty:'RSA',n:RFC7638_N,e:'AQAB',kid:'x',x5c:['a']}).indexOf('x5c')>=0,'x5c 提示');
ok(L({kty:'FOO'}).indexOf('不在 RFC 7518 注册表')>=0,'未知 kty');

// ---- lintJwks ----
function LJ(o){ return P.lintJwks(o).map(function(i){ return i.level+':'+i.msg; }).join('\n'); }
ok(LJ({keys:[]}).indexOf('keys 数组是空的')>=0,'空 JWKS');
ok(LJ({keys:'x'}).indexOf('keys 必须是数组')>=0,'keys 类型错');
ok(LJ({kty:'RSA',n:RFC7638_N,e:'AQAB',kid:'a'}).indexOf('单个 JWK 而不是 JWKS')>=0,'单 JWK 提示');
var dupe={keys:[{kty:'OKP',crv:'Ed25519',x:okp.x,kid:'same'},{kty:'OKP',crv:'Ed25519',x:okp.x,kid:'same'}]};
ok(LJ(dupe).indexOf('重复')>=0,'kid 重复被判 bad');
ok(LJ(dupe).indexOf('keys[0] ')>=0,'问题带上索引定位');
ok(LJ({keys:[{kty:'OKP',crv:'Ed25519',x:okp.x,kid:'a'},{kty:'OKP',crv:'Ed25519',x:okp.x,kid:'b'}]}).indexOf('轮换期同时挂新旧两把')>=0,'多密钥轮换提示');

// ---- buildJwks / publicPart / summarize ----
var built=P.buildJwks([okpPriv], true);
eq(built.keys.length,1,'构造出一把');
eq(built.keys[0].d,undefined,'私钥成员被剥掉');
eq(built.keys[0].kid,'kPrK_qmxVWaYVA9wwBF6Iuo3vVzz7TxHCTwXBygrS4k','kid 自动填成 RFC 7638 指纹');
eq(built.keys[0].alg,'EdDSA','alg 自动推断');
eq(built.keys[0].use,'sig','use 自动补 sig');
eq(P.hasPrivate(okpPriv),'d','检出私钥成员');
eq(P.hasPrivate(okp),null,'公钥无私钥成员');
eq(P.publicPart(ecPriv).d,undefined,'publicPart 去掉 d');
eq(P.publicPart(ecPriv).x,ecPriv.x,'publicPart 保留 x');
var sm=P.summarize(okpPriv);
eq(sm.kty,'OKP','摘要 kty');
eq(sm.bits,256,'摘要位数');
eq(sm.visibility,'私钥（含 d）','摘要可见性');
eq(sm.alg,'EdDSA','摘要 alg');
eq(P.summarize(ecJwk).visibility,'公钥','公钥摘要');
eq(P.suggestAlg({kty:'EC',crv:'P-521'}),'ES512','P-521 → ES512');
eq(P.suggestAlg({kty:'oct'}),'HS256','oct → HS256');
eq(P.jsonParse('{bad').error.indexOf('JSON 解析失败')>=0,true,'JSON 错误可读');
eq(P.jsonParse('{"a":1}').value.a,1,'JSON 正常解析');

console.log((fail? 'FAILED ':'PASS ')+pass+' assertions, '+fail+' failures');
process.exit(fail?1:0);
