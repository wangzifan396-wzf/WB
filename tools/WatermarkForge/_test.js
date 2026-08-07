
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var p1=A.posFor(800,600,20,'center'); ok('center', p1.x===400 && p1.y===300);
var p2=A.posFor(800,600,20,'top-right'); ok('top-right', p2.x===780 && p2.y===20);
var p3=A.posFor(800,600,20,'bottom-left'); ok('bottom-left', p3.x===20 && p3.y===580);
var t=A.tileCount(1000,1000,100,20); ok('tileCount 1000/100/20 = 8x8', t.nx===8 && t.ny===8 && t.total===64);
console.log('WatermarkForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
