
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('stats',A.stats([80,90,100]).average===90&&A.stats([80,90,100]).max===100);
ok('w',A.weighted([{score:80,weight:1},{score:100,weight:3}])===95);
ok('pass',A.passRate([60,70,50],60).passed===2&&A.passRate([60,70,50],60).rate===2/3);
ok('empty',A.stats([])===null);
console.log('ScoreForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
