
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('crc64 known', A.crc64xz(A.utf8('123456789'))==='0x995DC9BBDF1939FA');
ok('crc64 empty', typeof A.crc64xz(A.utf8(''))==='string');
ok('crc64 deterministic', A.crc64xz(A.utf8('hello'))===A.crc64xz(A.utf8('hello')));
ok('crc64 differs', A.crc64xz(A.utf8('a'))!==A.crc64xz(A.utf8('b')));
ok('crc64 format', /^0x[0-9A-F]{16}$/.test(A.crc64xz(A.utf8('x'))));
console.log('Crc64Forge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
