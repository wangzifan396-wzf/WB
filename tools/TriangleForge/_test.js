
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r=A.solveSSS(3,4,5);
ok('3-4-5 right angle C~90', Math.abs(r.C-90)<1e-6);
ok('3-4-5 area=6', Math.abs(r.area-6)<1e-9);
ok('equilateral angles 60', (function(){var e=A.solveSSS(1,1,1);return Math.abs(e.A-60)<1e-6&&Math.abs(e.B-60)<1e-6;})());
ok('invalid triangle null', A.solveSSS(1,2,10)===null);
ok('areaHeron(3,4,5)=6', Math.abs(A.areaHeron(3,4,5)-6)<1e-9);
console.log('TriangleForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
