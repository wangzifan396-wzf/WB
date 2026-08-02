const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('crc32 empty=0', A.crc32('')===0);
ok('crc32 vector 123456789', A.crc32('123456789')===0xCBF43926);
ok('crc16 vector 123456789', A.crc16ccitt('123456789')===0x29B1);
ok('crc16 empty=0xFFFF', A.crc16ccitt('')===0xFFFF);
ok('crc32 uint32', A.crc32('x')>=0 && A.crc32('x')<4294967296);
ok('crc32 deterministic', A.crc32('hello')===A.crc32('hello'));
ok('crc16 deterministic', A.crc16ccitt('hello')===A.crc16ccitt('hello'));
ok('crc32 differs', A.crc32('a')!==A.crc32('b'));
ok('crc16 differs', A.crc16ccitt('a')!==A.crc16ccitt('b'));
ok('crc32 hex len<=8', A.crc32('test').toString(16).length<=8);
ok('crc16 bound', A.crc16ccitt('test')<0x10000);
ok('crc32 self-equality', A.crc32('The quick brown fox')===A.crc32('The quick brown fox'));
console.log('CrcForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
