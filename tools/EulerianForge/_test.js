
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var tri=A.euler(3,[[0,1],[1,2],[2,0]]);
ok('triangle ok', tri.ok===true);
ok('triangle circuit len 4', tri.circuit.length===4);
var res=A.euler(3,[[0,1],[1,2]]);
ok('path odd degree', res.ok===false && res.reason==='odd degree');
console.log('EulerianForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
