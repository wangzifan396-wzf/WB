
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var p=A.sieve(30);
ok('primes <=30 count 10', p.length===10);
ok('primes <=30 last 29', p[p.length-1]===29);
ok('primes <=10', JSON.stringify(A.sieve(10))==='[2,3,5,7]');
console.log('SieveForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
