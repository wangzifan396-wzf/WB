
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('check value 123456789', A.crc32Str('123456789')==='cbf43926');
ok('empty', A.crc32Str('')==='00000000');
ok('abc', A.crc32Str('abc')==='352441c2');
ok('byte array', A.crc32Hex([0x31,0x32,0x33,0x34,0x35,0x36,0x37,0x38,0x39])==='cbf43926');
ok('deterministic', A.crc32([1,2,3])===A.crc32([1,2,3]));
console.log('Crc32Forge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
