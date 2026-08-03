
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('sm3 empty', A.sm3('')==='1ab21d8355cfa17f8e61194831e81a8f22bec8c728fefb747ed035eb5082aa2b');
ok('sm3 abc', A.sm3('abc')==='66c7f0f462eeedd9d1f2d46bdc10e4e24167c4875cf2f7a2297da02b8f4ba8e0');
ok('sm3 deterministic', A.sm3('hello')===A.sm3('hello'));
ok('sm3 differs', A.sm3('a')!==A.sm3('b'));
ok('sm3 hex input', A.sm3([0x61,0x62,0x63])==='66c7f0f462eeedd9d1f2d46bdc10e4e24167c4875cf2f7a2297da02b8f4ba8e0');
ok('sm3 long', A.sm3('The quick brown fox jumps over the lazy dog').length===64);
console.log('Sm3Forge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
