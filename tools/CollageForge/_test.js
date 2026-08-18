
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var p=A.collagePlan(6,3,10,100);
ok('count', p.pos.length===6);
ok('cols', p.cols===3 && p.rows===2);
ok('size', p.w===320 && p.h===210);
ok('nonoverlap', p.pos[0].x===0 && p.pos[1].x===110 && p.pos[3].y===110);
ok('clamp', A.collagePlan(2,9,0,50).cols===2);
console.log('CollageForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
