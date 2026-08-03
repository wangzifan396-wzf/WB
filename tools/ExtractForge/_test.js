
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('email', A.extract('a foo@bar.com b x@y.org','email').length===2);
ok('url', A.extract('see https://a.com/x and http://b.org','url').length===2);
ok('ipv4', A.extract('10.0.0.1 and 999.1.1.1','ipv4').join(',')==='10.0.0.1');
ok('hex', A.extract('color #fff and #1a2b3c end','hexcolor').join(',')==='#fff,#1a2b3c');
ok('number', A.extract('a 12 b -3.5 c','number').join(',')==='12,-3.5');
ok('custom', A.extract('XabX','custom','X').length===2);
console.log('ExtractForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
