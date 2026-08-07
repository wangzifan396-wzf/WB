
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r=A.kruskal(4, [[0,1,1],[0,2,2],[1,2,2],[1,3,3],[2,3,4]]);
ok('mst weight 6', r.weight===6);
ok('mst edges 3', r.edges.length===3);
console.log('SpanningTreeForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
