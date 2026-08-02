
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=/<script>([\s\S]*?)<\/script>/.exec(html);
const mod={exports:{}};
new Function('module','exports','require', m[1])(mod,mod.exports,require);
const P=mod.exports;
let pass=0,fail=0;
function ok(c,msg){ if(c){pass++;} else {fail++; console.error('FAIL: '+msg);} }
function eq(a,b,msg){ ok(a===b, msg+' (got '+JSON.stringify(a)+', want '+JSON.stringify(b)+')'); }

// RFC 6070 PBKDF2-HMAC-SHA1 向量
eq(P.derive('password','salt',1,20,'SHA1').hex, '0c60c80f961f0e71f3a9b524af6012062fe037a6', 'SHA1 c=1');
eq(P.derive('password','salt',2,20,'SHA1').hex, 'ea6c014dc72d6f8ccd1ed92ace1d41f0d8de8957', 'SHA1 c=2');
eq(P.derive('password','salt',4096,20,'SHA1').hex, '4b007901b765489abead49d926f721d065a429c1', 'SHA1 c=4096');
eq(P.derive('passwordPASSWORDpassword','saltSALTsaltSALTsalt',4096,25,'SHA1').hex,
   'e0a905d17abb401549e50f58cd7056c6601d97e0d61f627ce8', 'SHA1 long');

// RFC 7914 派生的 PBKDF2-HMAC-SHA256 向量
eq(P.derive('password','salt',1,32,'SHA256').hex,
   '120fb6cffcf8b32c43e7225256c4f837a86548c92ccc35480805987cb70be17b', 'SHA256 c=1');
eq(P.derive('password','salt',2,32,'SHA256').hex,
   'ae4d0c95af6b46d32d0adff928f06dd02a303f8ef3c251dfd6e2d85a95474c43', 'SHA256 c=2');
eq(P.derive('password','salt',4096,32,'SHA256').hex,
   'c5e478d59288c841aa530db6845c4c8d962893a001ce4e11a4963873aa98134a', 'SHA256 c=4096');
eq(P.derive('passwordPASSWORDpassword','saltSALTsaltSALTsalt',4096,40,'SHA256').hex,
   'df644cbc2dea89b5e6ecf8ead5dfee42c1a279b0d4fe24ff36231db5ff365b5744e60e3e8ce9e0c5', 'SHA256 long (40B)');
eq(P.derive('pass\x00word','sa\x00lt',4096,16,'SHA256').hex,
   '89b69d0516f829893c696226650a8687', 'SHA256 embedded NUL');

// 十六进制盐路径
eq(P.derive('password','0x73616c74',1,20,'SHA1').hex, '0c60c80f961f0e71f3a9b524af6012062fe037a6', 'hex salt 等价于 "salt"');

// 错误处理
ok(P.derive('p','s',0,16,'SHA256').error!=null, 'iters=0 报错');
ok(P.derive('p','s',1,0,'SHA256').error!=null, 'keylen=0 报错');

// 建议（OWASP 2023：PBKDF2-SHA256 推荐 >= 60 万次）
ok(P.advise(600000,'SHA256').tone==='ok', '600k 迭代给 ok');
ok(P.advise(100000,'SHA256').tone!=='ok', '10w 迭代不给 ok');

// 随机盐长度为 16 字节的 hex（32 字符）
ok(/^[0-9a-f]{32}$/.test(P.genSalt(16)), 'genSalt(16) 出 32 位 hex');

console.log((fail?'FAILED ':'PASS ')+pass+' assertions, '+fail+' failures');
if(fail) process.exit(1);
