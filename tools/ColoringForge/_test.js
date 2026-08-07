
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var tri=['A','B','C']; var te=[['A','B'],['B','C'],['C','A']];
var r=A.colorGraph(tri,te);
ok('triangle 3 colors', r.colorsUsed===3);
ok('triangle valid', r.valid===true);
var bip=['1','2','3','4']; var be=[['1','2'],['2','3'],['3','4'],['4','1']];
var r2=A.colorGraph(bip,be);
ok('bipartite 2 colors', r2.colorsUsed===2);
ok('bipartite valid', r2.valid===true);
console.log('ColoringForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
