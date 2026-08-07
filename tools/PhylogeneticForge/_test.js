
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r=A.upgma(['A','B','C'],[[0,1,2],[1,0,3],[2,3,0]]);
ok('root height 1.25', Math.abs(r.height-1.25)<1e-9);
ok('root name C/A/B', r.root==='C/A/B');
var r2=A.upgma(['X','Y'],[[0,4],[4,0]]);
ok('two-taxa height 2', Math.abs(r2.height-2)<1e-9);
console.log('PhylogeneticForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
