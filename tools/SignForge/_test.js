
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('sha256 abc', A.sha256hex('abc')==='ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
ok('hmac rfc4231 1', A.sign('Jefe','what do ya want for nothing?')==='5bdcc146bf60754e6a042426089575c75a003f089d2739839dec58b964ec3843');
var k2=''; for(var i2=0;i2<20;i2++)k2+='\u000b';
ok('hmac rfc4231 2', A.sign(k2,'Hi There')==='b0344c61d8db38535ca8afceaf0bf12b881dc200c9833da726e9376c2e32cff7');
ok('verify ok', A.verify('Jefe','what do ya want for nothing?','5bdcc146bf60754e6a042426089575c75a003f089d2739839dec58b964ec3843'));
ok('verify bad', A.verify('Jefe','tampered','5bdcc146bf60754e6a042426089575c75a003f089d2739839dec58b964ec3843')===false);
console.log('SignForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
