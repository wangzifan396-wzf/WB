
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('factorial(0)=1', A.factorial(0)===1n);
ok('factorial(5)=120', A.factorial(5)===120n);
ok('factorial(10)=3628800', A.factorial(10)===3628800n);
ok('doubleFactorial(7)=105', A.doubleFactorial(7)===105n);
console.log('FactorialForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
