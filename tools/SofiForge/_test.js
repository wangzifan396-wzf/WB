
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('rms0', A.rms([])===0);
ok('rms', Math.abs(A.rms([1,-1,1,-1])-1)<1e-9);
ok('snr', Math.abs(A.snrDb(100,1)-20)<1e-9);
ok('inf', A.snrDb(1,0)===Infinity);
var s=[]; for(var i=0;i<200;i++) s.push(Math.sin(i));
var nz=A.addNoise(s,20,Math.random); ok('len', nz.length===s.length);
console.log('SofiForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
