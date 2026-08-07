
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('evalRPN 2 3 + =5', A.evalRPN(['2','3','+'])===5);
ok('evalRPN 2 3 + 4 * =20', A.evalRPN(['2','3','+','4','*'])===20);
ok('evalRPN 4 2 / =2', A.evalRPN(['4','2','/'])===2);
ok('evalRPN invalid NaN', isNaN(A.evalRPN(['2','+'])));
console.log('StackForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
