
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var mono=A.toMono([0.2,0.4,0.6,0.8],2);
ok('mono',Math.abs(mono[0]-0.3)<1e-9 && Math.abs(mono[1]-0.7)<1e-9);
var st=A.toStereo([0.3,0.7]);
ok('stereo',JSON.stringify(st)===JSON.stringify([0.3,0.3,0.7,0.7]));
ok('bad',A.toMono([1,2],0)===null);
console.log('StereoMonoForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
