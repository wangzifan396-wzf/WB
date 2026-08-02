const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('roundtrip ascii', A.decode(A.encode('example'))==='example');
ok('encode munchen', A.encode('München')==='Mnchen-3ya');
ok('decode munchen', A.decode('Mnchen-3ya')==='München');
ok('encode domain', A.encodeDomain('münchen.de')==='xn--mnchen-3ya.de');
ok('decode domain', A.decodeDomain('xn--mnchen-3ya.de')==='münchen.de');
ok('encode domain ascii passthrough', A.encodeDomain('example.com')==='example.com');
ok('roundtrip cn label', A.decode(A.encode('例子'))==='例子');
ok('roundtrip cn domain', A.decodeDomain(A.encodeDomain('例子.测试'))==='例子.测试');
ok('decode invalid null', A.decode('!!!')===null);
ok('encode invalid null', A.encode('')==='');
console.log('PunyForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
