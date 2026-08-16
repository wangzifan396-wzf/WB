
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('len', A.spiralPoints({arms:3,points:10}).length===30);
ok('center', (function(){var p=A.spiralPoints({arms:1,points:2,turns:1,scale:5});return p.length===2 && Math.abs(p[1].x-5)<1e-9 && Math.abs(p[1].y-0)<1e-9;})());
ok('symmetric', (function(){var p=A.spiralPoints({arms:2,points:4});return p.length===8;})());
ok('count', A.count({arms:4,points:50})===200);
console.log('SpiralArtForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
