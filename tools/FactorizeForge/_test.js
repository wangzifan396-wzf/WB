
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('primefactors',A.primeFactors(360).map(function(p){return p[0];}).join(',')==='2,3,5');
ok('exp',A.primeFactors(360)[0][1]===3);
ok('isprime1',A.isPrime(17)===true);
ok('isprime2',A.isPrime(15)===false);
ok('nd',A.numberOfDivisors(12)===6);
ok('div',A.divisors(12).join(',')==='1,2,3,4,6,12');
ok('div1',A.divisors(1).join(',')==='1');
console.log('FactorizeForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
