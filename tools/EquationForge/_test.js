
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r=A.solve2(1,1,2,1,-1,0); ok('solve2', r && Math.abs(r.x-1)<1e-9 && Math.abs(r.y-1)<1e-9);
ok('solve2 null', A.solve2(1,1,1,2,2,2)===null);
var q=A.solveQuad(1,-3,2); ok('quad', q.length===2 && Math.abs(q[0]-2)<1e-9 && Math.abs(q[1]-1)<1e-9);
ok('quad one', A.solveQuad(1,2,1).length===1);
ok('quad none', A.solveQuad(1,0,1).length===0);
console.log('EquationForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
