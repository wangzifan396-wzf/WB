
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var a=A.timeAdd('23:30','01:00'); ok('wrap', a.result==='00:30' && a.totalMinutes===30);
ok('add', A.timeAdd('10:00','02:30').result==='12:30');
var d=A.timeDiff('09:00','17:00'); ok('diff', d.diff==='08:00' && d.minutes===480);
ok('diffwrap', A.timeDiff('23:00','01:00').minutes===120);
ok('err', !!A.timeAdd('x','01:00').error);
console.log('TimeCalcForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
