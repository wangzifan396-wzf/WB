
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('vol cube 2=8', A.volume('cube',{s:2})===8);
ok('vol sphere r=1=4/3 PI', Math.abs(A.volume('sphere',{r:1})-4/3*Math.PI)<1e-12);
ok('vol cylinder r1 h1=PI', Math.abs(A.volume('cylinder',{r:1,h:1})-Math.PI)<1e-12);
ok('vol cone r1 h3=PI', Math.abs(A.volume('cone',{r:1,h:3})-Math.PI)<1e-12);
ok('sa cube 2=24', A.surfaceArea('cube',{s:2})===24);
console.log('VolumeForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
