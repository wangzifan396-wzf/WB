
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('isPrime(17)', A.isPrime(17n)===true);
ok('isPrime(1)=false', A.isPrime(1n)===false);
ok('isPrime(2)', A.isPrime(2n)===true);
ok('factorString(360)=2^3*3^2*5', A.factorString(360n)==='2^3 * 3^2 * 5');
ok('factorString(13)=13', A.factorString(13n)==='13');
ok('primeFactors(1) empty', Object.keys(A.primeFactors(1n)).length===0);
console.log('PrimeFactorForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
