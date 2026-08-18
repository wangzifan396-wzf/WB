
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('sum', A.sumSegments([{start:0,end:3600000},{start:0,end:1800000}]).ms===5400000);
ok('fmt', A.fmt(3661000)==='1:01:01');
ok('fmt0', A.fmt(0)==='0:00:00');
console.log('WorkTimerForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
