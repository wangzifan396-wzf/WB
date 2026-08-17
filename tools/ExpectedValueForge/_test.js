
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r=A.ev([100,0,50],[0.1,0.8,0.1]);
ok('ev', Math.abs(r.ev-15)<1e-9);
ok('var', Math.abs(r.variance-1025)<1e-9);
ok('err', !!A.ev([1],[1,2]).error);
console.log('ExpectedValueForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
