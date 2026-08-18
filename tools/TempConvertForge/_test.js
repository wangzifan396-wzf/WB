
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('c2f', A.convertTemp(0,'C','F').value===32);
ok('c2k', Math.abs(A.convertTemp(0,'C','K').value-273.15)<1e-9);
ok('f2c', A.convertTemp(32,'F','C').value===0);
ok('k2c', Math.abs(A.convertTemp(273.15,'K','C').value)<1e-9);
ok('err', !!A.convertTemp('x','C','F').error);
console.log('TempConvertForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
