
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var s=[1,1,1,1]; var o=A.applyFade(s,1,1,1);
ok('first',o[0]===0);
ok('last',o[3]===0);
ok('mid',o[1]>0.9);
ok('bad',A.applyFade(s,0,1,1)===null);
console.log('AudioFadeForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
