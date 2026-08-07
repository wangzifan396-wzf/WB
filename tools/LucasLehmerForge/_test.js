
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('M2 prime', A.isMersennePrime(2)===true);
ok('M3 prime', A.isMersennePrime(3)===true);
ok('M5 prime', A.isMersennePrime(5)===true);
ok('M11 not prime', A.isMersennePrime(11)===false);
ok('M13 prime', A.isMersennePrime(13)===true);
console.log('LucasLehmerForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
