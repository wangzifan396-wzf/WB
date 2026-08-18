
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('err', !!A.meld(0,1,1).error);
var r=A.meld(1,1,1);
ok('base', Math.abs(r.meld-6.4)<0.2);
var r2=A.meld(2,1.5,1.2);
ok('mid', r2.meld>14 && r2.meld<17);
console.log('MeldForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
