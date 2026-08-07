
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('area circle r=1=PI', Math.abs(A.area('circle',{r:1})-Math.PI)<1e-12);
ok('area rect 3x4=12', A.area('rectangle',{w:3,h:4})===12);
ok('area triangle 3,4=6', A.area('triangle',{b:3,h:4})===6);
ok('area trapezoid 2,4,3=9', A.area('trapezoid',{a:2,b:4,h:3})===9);
ok('area ellipse=PI*3', Math.abs(A.area('ellipse',{a:1,b:3})-3*Math.PI)<1e-12);
console.log('AreaForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
