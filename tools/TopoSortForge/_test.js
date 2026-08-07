
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r=A.topo(3,[[0,1],[1,2]]);
ok('order len 3', r.order.length===3);
ok('order 0 first', r.order[0]===0);
ok('order 2 last', r.order[2]===2);
var cyc=A.topo(2,[[0,1],[1,0]]);
ok('cycle detected', cyc.hasCycle===true && cyc.order===null);
console.log('TopoSortForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
