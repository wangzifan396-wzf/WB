
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var pts=[[0,0],[0,1],[10,0],[10,1]];
var cs=A.cluster(pts,2);
ok('2 clusters', cs.length===2);
var sizes=cs.map(function(c){return c.length;}).sort();
ok('sizes [2,2]', JSON.stringify(sizes)==='[2,2]');
var c1=A.cluster([[0],[5],[5.1]],2);
ok('near pair merged', c1.length===2);
console.log('HierarchicalClusteringForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
