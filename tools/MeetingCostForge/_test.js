
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('cost', A.meetingCost([100,100],60).cost===200);
ok('half', A.meetingCost([60,60,60],30).cost===90);
ok('prep', A.withPrep([100],60,30).cost===150);
ok('annual', A.annual(200,12)===2400);
ok('err', !!A.meetingCost([],60).error);
console.log('MeetingCostForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
