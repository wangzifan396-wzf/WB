
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var d=A.oddsConvert('2.5','decimal');
ok('dec', Math.abs(d.decimal-2.5)<1e-9);
ok('prob', Math.abs(d.impliedProb-0.4)<1e-9);
ok('frac', d.fractional==='5/2');
ok('amer', d.american==='+150');
var a=A.oddsConvert('-200','american');
ok('neg', Math.abs(a.decimal-1.5)<1e-9 && a.impliedProb>0.66);
ok('err', !!A.oddsConvert('x','decimal').error);
console.log('OddsForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
