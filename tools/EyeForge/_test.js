
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('20/20', A.visionEval(20,20).decimal===1);
ok('logmar', A.visionEval(20,20).logmar===0);
ok('6/12', A.visionEval(6,12).decimal===0.5);
ok('level', A.visionEval(20,40).level.indexOf('下降')>=0);
ok('err', !!A.visionEval(0,20).error);
console.log('EyeForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
