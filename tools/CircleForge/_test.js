
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('area',Math.abs(A.fromRadius(1).area-Math.PI)<1e-9);
ok('circ',Math.abs(A.fromDiameter(2).circumference-2*Math.PI)<1e-9);
ok('sec',Math.abs(A.sectorArea(1,90)-Math.PI/4)<1e-9);
ok('arc',Math.abs(A.arcLength(1,180)-Math.PI)<1e-9);
ok('err',A.fromRadius(0)===null);
console.log('CircleForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
