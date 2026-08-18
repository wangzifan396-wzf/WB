
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('err', !!A.cockcroft(0,40,'male',1).error);
var r=A.cockcroft(70,40,'male',1.0);
ok('male', Math.abs(r.crcl-97.2)<0.2);
var f=A.cockcroft(60,40,'female',1.0);
ok('female', Math.abs(f.crcl-70.8)<0.2);
console.log('CockcroftForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
