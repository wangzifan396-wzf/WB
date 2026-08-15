
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('slope',A.slope(0,0,2,2)===1);
ok('vert',A.slope(1,0,1,5)===null);
ok('dist',Math.abs(A.distance(0,0,3,4)-5)<1e-9);
var mid=A.midpoint(0,0,2,4);ok('mid',mid.x===1 && mid.y===2);
var le=A.lineEquation(0,0,2,2);ok('line',Math.abs(le.m-1)<1e-9 && Math.abs(le.b)<1e-9);
var lv=A.lineEquation(3,0,3,9);ok('vline',lv.vertical===true && lv.x===3);
console.log('SlopeForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
