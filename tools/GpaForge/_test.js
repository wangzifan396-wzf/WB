
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('gradeToPoint A=4', A.gradeToPoint('A')===4);
ok('gradeToPoint B+=3.3', A.gradeToPoint('B+')===3.3);
ok('gpa 3/3 credits=3.5', Math.abs(A.gpa([{grade:'A',credit:3},{grade:'B',credit:3}])-3.5)<1e-9);
ok('gpa A4 A-2=3.9', Math.abs(A.gpa([{grade:'A',credit:4},{grade:'A-',credit:2}])-3.9)<1e-9);
console.log('GpaForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
