
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('fib(0)=0', A.fib(0)===0n);
ok('fib(1)=1', A.fib(1)===1n);
ok('fib(10)=55', A.fib(10)===55n);
ok('fib(20)=6765', A.fib(20)===6765n);
ok('fib(50)=12586269025', A.fib(50)===12586269025n);
ok('fibSequence(5) len6', A.fibSequence(5).length===6);
console.log('FibonacciForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
