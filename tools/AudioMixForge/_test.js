
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var m1=A.mixSamples([0.2,0.5],[0.4,0.2],1,1);
ok('mix',Math.abs(m1[0]-0.6)<1e-9 && m1[1]===0.7);
var m2=A.mixSamples([1,1],[1,1],1,1);
ok('clip',m2[0]===1 && m2[1]===1);
var n=A.norm([0.1,0.9],0.99);
ok('norm',Math.abs(Math.max.apply(null,n)-0.99)<1e-9);
console.log('AudioMixForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
