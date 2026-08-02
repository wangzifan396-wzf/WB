'use strict';
var fs=require('fs'), path=require('path'), vm=require('vm');
var html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
var m=/<script>([\s\S]*?)<\/script>/.exec(html);
if(!m) throw new Error('index.html 里找不到内核 script');
var mod={exports:{}};
new Function('module','exports','require', m[1])(mod, mod.exports, require);
var P=mod.exports;

var pass=0, fail=0;
function ok(c,msg){ if(c){pass++;} else {fail++; console.error('FAIL: '+msg);} }
function eq(a,b,msg){ if(a===b){pass++;} else {fail++; console.error('FAIL: '+msg+' (got '+JSON.stringify(a)+', want '+JSON.stringify(b)+')');} }
function seq(n,v){ var a=[]; for(var i=0;i<n;i++) a.push(v===undefined?(i&0xff):v); return a; }
function b64u(b){ return P.b64url(b); }

// ============ 真实世界锚点：GitHub 的 Ed25519 主机密钥 ============
var GH='ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOMqqnkVzrm0SdG6UOoqKLsabgH5C9okWi0dh2l9GKJl';
var gh=P.opensshToJwk(GH);
ok(!gh.error,'GitHub 主机密钥能解析'+(gh.error||''));
eq(gh.type,'ssh-ed25519','类型是 ssh-ed25519');
eq(gh.value.kty,'OKP','kty=OKP');
eq(gh.value.crv,'Ed25519','crv=Ed25519');
eq(P.b64decode(gh.value.x).length,32,'公钥 32 字节');
var ghf=P.fingerprints(gh.value);
eq(ghf.sshSha256,'SHA256:+DiY3wvvV6TuJJhbpZisF/zLDA0zPMSvHdkr4UvCOqU','SHA256 指纹与 GitHub 官方公示值一致');
ok(/^MD5:([0-9a-f]{2}:){15}[0-9a-f]{2}$/.test(ghf.md5||ghf.sshMd5),'MD5 指纹是 16 段冒号 hex');
eq(P.jwkToOpenssh(gh.value).value, GH.split(' ').slice(0,2).join(' '),'JWK → OpenSSH 往返回到原串');
eq(P.jwkToOpenssh(gh.value,'git@github').value, GH+' git@github','带注释时注释接在第三段');

// ============ RFC 8037 A.2/A.3 向量 ============
var okp={kty:'OKP', crv:'Ed25519', x:'11qYAYKxCrfVS_7TyWQHOg7hcvPapiMlrwIaaPcHURo'};
eq(P.thumbprint(okp).value,'kPrK_qmxVWaYVA9wwBF6Iuo3vVzz7TxHCTwXBygrS4k','RFC 8037 A.3 Ed25519 指纹');
eq(P.algOf(okp),'ed25519','algOf 认出 ed25519');
var okpSsh=P.jwkToOpenssh(okp);
ok(okpSsh.value.indexOf('ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI')===0,'ssh-ed25519 blob 前缀符合 RFC 4253 wire');
eq(P.sshBlobToJwk(okpSsh.blob).value.x, okp.x,'blob → JWK 坐标不变');

// ============ RFC 7638 A.1 RSA 向量 ============
var rsaN='0vx7agoebGcQSuuPiLJXZptN9nndrQmbXEps2aiAFbWhM78LhWx4cbbfAAtVT86zwu1RK7aPFFxuhDR1L6tSoc_BJECPebWKRXjBZCiFV4n3oknjhMstn64tZ_2W-5JsGY4Hc5n9yBXArwl93lqt7_RN5w6Cf0h4QyQ5v-65YGjQR0_FDW2QvzqY368QQMicAtaSqzs8KJZgnYb9c7d0zgdAZHzu6qMQvRL5hajrn1n91CbOpbISD08qNLyrdkt-bFTWhAI4vMQFh6WeZu0fM4lFd2NcRwr3XPksINHaQ-G_xBniIqbw0Ls1jF44-csFCur-kEgU8awapJzKnqDKgw';
var rsa={kty:'RSA', n:rsaN, e:'AQAB'};
eq(P.thumbprint(rsa).value,'NzbLsXh8uDCcd-6MNwXF4W_7noWXFZAfHkxZsRGC9Xs','RFC 7638 A.1 RSA 指纹');
eq(P.algOf(rsa),'rsa2048','2048 位归入 rsa2048 档');
var rsaSsh=P.jwkToOpenssh(rsa,'svc@build');
ok(rsaSsh.value.indexOf('ssh-rsa AAAAB3NzaC1yc2E')===0,'ssh-rsa blob 前缀正确');
var rsaBack=P.opensshToJwk(rsaSsh.value);
eq(rsaBack.value.n, rsa.n,'ssh-rsa 往返 n 不变');
eq(rsaBack.value.e, 'AQAB','ssh-rsa 往返 e 不变');
eq(rsaBack.comment,'svc@build','注释被完整取回');

// mpint：最高位为 1 必须补 0x00，否则 OpenSSH 会当成负数
var hi=P.mpint([0x80,0x01]);
eq(P.toHex(hi),'0000000300800 1'.replace(' ',''),'mpint 高位为 1 时补前导零');
var lo=P.mpint([0x7f,0x01]);
eq(P.toHex(lo),'000000027f01','mpint 高位为 0 时不补');
eq(P.toHex(P.mpint([0,0,0x05])),'000000010 5'.replace(' ',''),'mpint 去掉多余前导零');

// ============ EC P-256 ============
var ec={kty:'EC', crv:'P-256',
        x:'f83OJ3D2xF1Bg8vub9tLe1gHMzV76e8Tus9uPHvRVEU',
        y:'x_FEzRu9m36HLN_tue659LNpXW6pCyStikYjKIWI5a0'};
eq(P.algOf(ec),'p256','algOf 认出 P-256');
var ecSsh=P.jwkToOpenssh(ec);
ok(ecSsh.value.indexOf('ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTY')===0,
   'ecdsa-sha2-nistp256 blob 含类型串与曲线名两段');
var ecBack=P.opensshToJwk(ecSsh.value).value;
eq(ecBack.x, ec.x,'EC x 往返'); eq(ecBack.y, ec.y,'EC y 往返'); eq(ecBack.crv,'P-256','EC 曲线往返');
eq(P.thumbprint(ecBack).value, P.thumbprint(ec).value,'EC 往返后指纹不变');

// 压缩点要给出可操作的提示，而不是静默失败
var comp=[].concat(P.utf8Bytes('ecdsa-sha2-nistp256'));
var blobC=[0,0,0,19].concat(comp,[0,0,0,8],P.utf8Bytes('nistp256'),[0,0,0,33],[2],seq(32,0x11));
var rc=P.sshBlobToJwk(blobC);
ok(!!rc.error && /压缩点/.test(rc.error),'压缩点被识别并解释原因');

// 坐标长度不对要说清应该是多少
var blobL=[0,0,0,19].concat(comp,[0,0,0,8],P.utf8Bytes('nistp256'),[0,0,0,33],[4],seq(32,0x11));
ok(/坐标长度不对/.test(P.sshBlobToJwk(blobL).error||''),'坐标长度不足时报错并给出期望值');

// ============ 已弃用 / 特殊类型的引导 ============
var dss=[0,0,0,7].concat(P.utf8Bytes('ssh-dss'),[0,0,0,1],[1]);
ok(/ssh-dss|DSA/.test(P.sshBlobToJwk(dss).error||''),'ssh-dss 给出弃用说明');
ok(/Ed25519/.test(P.sshBlobToJwk(dss).error||''),'ssh-dss 的报错里直接给出替代方案');
var sk=[0,0,0,34].concat(P.utf8Bytes('sk-ssh-ed25519@openssh.com'),seq(8,0));
ok(/FIDO|硬件/.test(P.sshBlobToJwk([0,0,0,26].concat(P.utf8Bytes('sk-ssh-ed25519@openssh.com'))).error||''),
   'sk-* 硬件密钥被单独说明');

// 行首声明与实际内容不符（复制粘贴串行）
var mixed='ssh-rsa '+ecSsh.value.split(' ')[1];
ok(/行首写的是/.test(P.opensshToJwk(mixed).error||''),'类型声明与 blob 不符时点破');

// ============ 指纹家族 ============
var f=P.fingerprints(okp);
eq(f.jwkThumb,'kPrK_qmxVWaYVA9wwBF6Iuo3vVzz7TxHCTwXBygrS4k','fingerprints 里的 RFC 7638 值');
ok(/^sha256\/[A-Za-z0-9+/]{43}=$/.test(f.spkiPin),'SPKI pin 是 sha256/ 前缀的 base64');
eq(f.spkiLen, 44,'Ed25519 SPKI 共 44 字节');
eq(f.x509Ski.length, 40,'X.509 SKI 是 40 位 hex（SHA-1）');
eq(f.x509Ski, P.toHex(P.sha1Bytes(P.b64decode(okp.x))).toUpperCase(),'SKI = SHA-1(BIT STRING 内容)，不含 tag/len/unused');
eq(f.sshType,'ssh-ed25519','fingerprints 带出 SSH 类型');
// X25519 不能签名，SSH 那一栏应给出理由而不是空白
var x25519={kty:'OKP', crv:'X25519', x:okp.x};
var fx=P.fingerprints(x25519);
ok(!fx.sshSha256 && /密钥协商/.test(fx.sshErr||''),'X25519 明确说明不能做 SSH 认证密钥');
ok(!!fx.spkiPin,'X25519 仍然有 SPKI 指纹');

// spkiBitString 只取内容
var spki=P.jwkToSpki(okp).value;
eq(P.toHex(P.spkiBitString(spki)), P.toHex(P.b64decode(okp.x)),'spkiBitString 剥掉 unused-bits 字节');

// ============ 配对校验 ============
var okpPriv={kty:'OKP', crv:'Ed25519', x:okp.x, d:b64u(seq(32,0x42))};
var mp=P.samePublic(okpPriv, okp);
ok(mp.match,'私钥与其公钥判定为同一把');
eq(mp.thumbprint,'kPrK_qmxVWaYVA9wwBF6Iuo3vVzz7TxHCTwXBygrS4k','配对时回带指纹');
var other={kty:'OKP', crv:'Ed25519', x:b64u(seq(32,0x09))};
ok(!P.samePublic(okpPriv, other).match,'不同公钥判定为不匹配');
var cross=P.samePublic(okp, ec);
ok(!cross.match && /kty|曲线/.test(cross.reason),'kty 不同的两把给出具体差异');

// ============ 全格式导出 ============
var all=P.allFormats(okpPriv,'ci@runner');
ok(all.hasPrivate,'识别出含私钥');
eq(all.alg,'ed25519','导出时带上算法档位');
ok(all.pemPublic.indexOf('-----BEGIN PUBLIC KEY-----')===0,'公钥 PEM 头');
ok(all.pemPrivate.indexOf('-----BEGIN PRIVATE KEY-----')===0,'私钥导出为 PKCS#8 而不是老式 PEM');
ok(all.openssh.indexOf('ssh-ed25519 ')===0 && /ci@runner$/.test(all.openssh),'OpenSSH 行带注释');
ok(JSON.parse(all.jwkPublic).d===undefined,'公钥 JWK 里不含 d');
eq(JSON.parse(all.jwkPrivate).d, okpPriv.d,'私钥 JWK 保留 d');
eq(all.fingerprints.jwkThumb, f.jwkThumb,'导出里的指纹与单独计算一致');
var allPub=P.allFormats(okp);
ok(!allPub.hasPrivate && allPub.pemPrivate===undefined,'纯公钥不会凭空生成私钥段');
// X25519 导出：PEM 有，OpenSSH 应给理由
var allX=P.allFormats(x25519);
ok(!!allX.pemPublic && !allX.openssh && /协商/.test(allX.opensshErr||''),'X25519 导出缺 OpenSSH 但解释了原因');

// ============ 输入识别 ============
eq(P.detectKey(GH).from,'OpenSSH','认出 OpenSSH 单行');
eq(P.detectKey(P.jwkToPem(okp,false).value).from,'PEM','认出 PEM');
eq(P.detectKey(JSON.stringify(okp)).from,'JWK','认出 JWK');
eq(P.detectKey(JSON.stringify({keys:[okp]})).from,'JWKS 的第一把','认出 JWKS 并取第一把');
eq(P.detectKey(P.toHex(spki)).from,'DER（hex）','认出裸 DER 的十六进制');
eq(P.detectKey(P.toHex(spki).toUpperCase().replace(/(..)/g,'$1 ')).from,'DER（hex）','hex 允许大写和空格');
eq(P.detectKey(JSON.stringify(okp)).value.x, okp.x,'识别后返回可用的 JWK');
ok(/认不出输入格式/.test(P.detectKey('hello world').error||''),'无法识别时给出支持列表');
ok(/空/.test(P.detectKey('   ').error||''),'空输入有专门提示');

// ============ 生成命令 ============
var c=P.genCommands('ed25519',{comment:'me@box', file:'id_ed'});
ok(c.length>=5,'ed25519 至少给出 5 条命令');
ok(c.some(function(x){ return /ssh-keygen -t ed25519/.test(x.cmd) && /me@box/.test(x.cmd) && /id_ed/.test(x.cmd); }),
   '命令里代入了注释与文件名');
ok(c.some(function(x){ return /genpkey -algorithm ed25519/.test(x.cmd); }),'给出 openssl 写法');
ok(c.some(function(x){ return /dgst -sha256 -binary/.test(x.cmd); }),'给出证书固定指纹的算法');
var cr=P.genCommands('rsa3072',{});
ok(cr.some(function(x){ return /rsa_keygen_bits:3072/.test(x.cmd); }),'RSA 位数代入正确');
ok(cr.some(function(x){ return /genrsa/.test(x.note||''); }),'提醒 genrsa 会吐 PKCS#1');
var cp=P.genCommands('p256',{});
ok(cp.some(function(x){ return /prime256v1/.test(x.cmd); }),'P-256 用 OpenSSL 的别名 prime256v1');
ok(cp.some(function(x){ return /prime256v1/.test(x.note||''); }),'并解释这个别名');
var cx=P.genCommands('x25519',{});
ok(!cx.some(function(x){ return /ssh-keygen -t/.test(x.cmd); }),'X25519 不给 ssh-keygen 生成命令');
eq(P.genCommands('nope',{}).length, 0,'未知算法返回空数组');

// ============ 选型建议 ============
var a=P.advise('tls');
eq(a.rows[0].alg,'p256','TLS 场景首选 P-256');
eq(a.rows[0].tone,'ok','首选标记为 ok');
ok(a.rows.some(function(r){ return r.alg==='ed25519' && r.tone==='warn'; }),'TLS 场景把 Ed25519 标为不适用');
ok(/CA/.test(a.why),'给出理由而不是只给结论');
eq(P.advise('ssh').rows[0].alg,'ed25519','SSH 场景首选 Ed25519');
eq(P.advise('exchange').rows[0].alg,'x25519','协商场景首选 X25519');
ok(P.advise('exchange').rows.some(function(r){ return r.alg==='ed25519' && r.tone==='warn'; }),
   '协商场景把签名密钥标为不可混用');
ok(/没有这个场景/.test(P.advise('zzz').error||''),'未知场景有错误');
var scenes=Object.keys(P.KP_SCENES);
ok(scenes.length>=6,'至少覆盖 6 个场景');
for(var si=0;si<scenes.length;si++){
  var r=P.advise(scenes[si]);
  ok(!r.error && r.rows.length>=1 && !!r.why, '场景 '+scenes[si]+' 的建议完整');
  ok(!!P.KP_ALGS[P.KP_SCENES[scenes[si]].pick], '场景 '+scenes[si]+' 的首选算法在算法表里');
}
// 每个算法都要有正反两面，不能只吹不黑
var algs=Object.keys(P.KP_ALGS);
for(var ai=0;ai<algs.length;ai++){
  ok(!!P.KP_ALGS[algs[ai]].good && !!P.KP_ALGS[algs[ai]].bad, algs[ai]+' 同时写清适用与不适用');
  ok(P.KP_ALGS[algs[ai]].sec>=112, algs[ai]+' 标注了安全强度');
}

console.log((fail? 'FAILED ':'PASS ')+pass+' assertions, '+fail+' failures');
if(fail) process.exit(1);
