
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('isPrime(2)', A.isPrime(2)===true);
ok('isPrime(1) false', A.isPrime(1)===false);
ok('isPrime(97)', A.isPrime(97)===true);
ok('isPrime(91) false (7*13)', A.isPrime(91)===false);
ok('gcd(12,18)=6', A.gcd(12,18)===6);
ok('lcm(12,18)=36', A.lcm(12,18)===36);
var f=A.factorize(360); ok('factorize(360) product', Math.pow(2,f[2])*Math.pow(3,f[3])*Math.pow(5,f[5])===360 && f[2]===3 && f[3]===2 && f[5]===1);
ok('primesUpTo(10)', JSON.stringify(A.primesUpTo(10))===JSON.stringify([2,3,5,7]));
ok('nextPrime(10)=11', A.nextPrime(10)===11);
ok('prevPrime(10)=7', A.prevPrime(10)===7);
ok('prevPrime(2) null', A.prevPrime(2)===null);
ok('factorString(360)', A.factorString(360)==="2^3 × 3^2 × 5");
console.log('PrimeForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
