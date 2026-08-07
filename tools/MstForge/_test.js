
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var nodes=['A','B','C','D'];
var edges=[['A','B',1],['B','C',2],['C','D',3],['A','C',4],['B','D',5]];
var r=A.mst(nodes,edges);
ok('total 6', r.total===6);
ok('3 edges', r.edges.length===3);
console.log('MstForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
