
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('log(2,8)=3', Math.abs(A.log(2,8)-3)<1e-12);
ok('log10(1000)=3', Math.abs(A.log10(1000)-3)<1e-12);
ok('ln(e)=1', Math.abs(A.ln(Math.E)-1)<1e-12);
ok('antilog(2,3)=8', Math.abs(A.antilog(2,3)-8)<1e-12);
ok('log(1,x)=NaN', isNaN(A.log(1,5)));
console.log('LogarithmForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
