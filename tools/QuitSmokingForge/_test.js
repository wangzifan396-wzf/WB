
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('err', !!A.quitSmoking(0,10,5).error);
var r=A.quitSmoking(20,50,10);
ok('daily', Math.abs(r.dailyCost-50)<1e-6);
ok('year', Math.abs(r.yearlyCost-18250)<1);
ok('total', Math.abs(r.totalCost-182500)<1);
console.log('QuitSmokingForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
