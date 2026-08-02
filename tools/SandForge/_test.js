
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
const mod={exports:{}};
new Function('module','exports','require',m[1])(mod,mod.exports,require);
const P=mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }
var s=P.sandInit(10,10);
ok(s.cells.length===100,'init size');
P.sandSet(s,5,0,1);
ok(P.sandCount(s)===1,'one sand');
var cur=s;
for(var k=0;k<9;k++) cur=P.sandStep(cur);
ok(cur.cells[9*10+5]===1,'sand fell to bottom row');
ok(P.sandCount(cur)===1,'sand count conserved after fall');
var sw=P.sandInit(10,10); P.sandSet(sw,5,0,1); P.sandSet(sw,5,9,2);
var cw=sw; for(var k=0;k<20;k++) cw=P.sandStep(cw);
ok(cw.cells[9*10+5]===2,'wall cell stays wall after many steps');
ok(P.sandCount(cw)===1,'sand conserved over wall');
var a=P.sandInit(8,8), b=P.sandInit(8,8); P.sandSet(a,3,0,1); P.sandSet(b,3,0,1);
ok(JSON.stringify(P.sandStep(a).cells)===JSON.stringify(P.sandStep(b).cells),'deterministic');
// wall never falls
var w2=P.sandInit(6,6); P.sandSet(w2,2,2,2);
var w3=P.sandStep(w2);
ok(w3.cells[2*6+2]===2,'wall stays put');
console.log('PASS '+n+' assertions');
