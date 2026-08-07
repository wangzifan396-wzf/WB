
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('isPrime 97', A.isPrime(97)===true);
ok('isPrime 91 false', A.isPrime(91)===false);
ok('isPrime 104729', A.isPrime(104729)===true);
ok('isPrime 1000003', A.isPrime(1000003)===true);
ok('isPrime 561 carmichael false', A.isPrime(561)===false);
console.log('MillerRabinForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
