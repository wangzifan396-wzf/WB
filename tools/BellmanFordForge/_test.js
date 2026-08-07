
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var edges=[[0,1,4],[0,2,5],[1,2,-3]];
var r=A.bellman(3,edges,0);
ok('d1=4', r.dist[1]===4);
ok('d2=1', r.dist[2]===1);
ok('no neg cycle', r.negativeCycle===false);
var cyc=[[0,1,-1],[1,0,-1]];
var r2=A.bellman(2,cyc,0);
ok('neg cycle detected', r2.negativeCycle===true);
console.log('BellmanFordForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
