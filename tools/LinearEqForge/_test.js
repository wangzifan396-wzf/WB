
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('l1',A.solveLinear(2,-4)===2);
ok('l0',A.solveLinear(0,5)===null);
ok('lz',A.solveLinear(3,0)===0);
var s=A.solve2x2(2,1,1,3,8,9);ok('sys',Math.abs(s.x-3)<1e-9 && Math.abs(s.y-2)<1e-9);
ok('sing',A.solve2x2(1,2,2,4,5,10)===null);
console.log('LinearEqForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
