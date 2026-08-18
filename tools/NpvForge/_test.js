
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('err', !!A.npv('x',100,'100').error);
var r=A.npv(0.1, 1000, '500 600');
ok('neg', Math.abs(r.npv+49.5)<1);
var r2=A.npv(0.1, 1000, '1100');
ok('zero', Math.abs(r2.npv)<1);
console.log('NpvForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
