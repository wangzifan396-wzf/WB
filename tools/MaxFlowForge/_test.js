
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var nodes=['0','1','2','3'];
var edges=[['0','1',3],['0','2',2],['1','3',2],['1','2',1],['2','3',3]];
ok('maxflow 5', A.maxFlow(nodes,edges,'0','3')===5);
console.log('MaxFlowForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
