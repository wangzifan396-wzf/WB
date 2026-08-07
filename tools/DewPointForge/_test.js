
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('dewPoint(20,50)~9.26', Math.abs(A.dewPoint(20,50)-9.26)<1e-1);
ok('dewPoint(20,100)=20', Math.abs(A.dewPoint(20,100)-20)<1e-6);
ok('dewPoint(20,0)=NaN', isNaN(A.dewPoint(20,0)));
ok('absoluteHumidity(20,50)~8.6', Math.abs(A.absoluteHumidity(20,50)-8.62)<1e-1);
console.log('DewPointForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
