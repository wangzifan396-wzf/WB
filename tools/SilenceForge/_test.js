
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var sr=1000, s=[], i;
for(i=0;i<500;i++) s.push(0);
for(i=0;i<1000;i++) s.push(0.3);
for(i=0;i<500;i++) s.push(0);
var r=A.detectSilence(s,sr,{thresholdDb:-50,minSilenceSec:0.3,padSec:0.05});
ok('runs', r.runs.length===2 && r.runs[0].startMs===0 && r.runs[0].endMs===500 && r.runs[0].durSec===0.5 && r.runs[1].startMs===1500 && r.runs[1].endMs===2000);
ok('totals', r.silenceTotalSec===1 && r.silenceRatio===0.5 && r.durationSec===2 && r.allSilent===false);
ok('segs', r.segments.length===1 && r.segments[0].startMs===500 && r.segments[0].endMs===1500 && r.segments[0].durSec===1);
ok('trim', r.trim && r.trim.startMs===450 && r.trim.endMs===1550 && r.trim.savesMs===900);
var s2=[];
for(i=0;i<1000;i++) s2.push(0.3);
for(i=0;i<100;i++) s2.push(0);
for(i=0;i<900;i++) s2.push(0.3);
var r2=A.detectSilence(s2,sr,{thresholdDb:-50,minSilenceSec:0.3,padSec:0.05});
ok('shortgap', r2.runs.length===0 && r2.silenceTotalSec===0 && r2.segments.length===1 && r2.segments[0].durSec===2 && r2.trim.startMs===0 && r2.trim.endMs===2000 && r2.trim.savesMs===0);
var r3=A.detectSilence(new Array(1000).fill(0),sr,{});
ok('allsilent', r3.allSilent===true && r3.trim===null && r3.segments.length===0 && r3.silenceTotalSec===1);
ok('defaults', A.detectSilence(s,sr,{}).runs.length===2);
ok('err', !!A.detectSilence([],sr,{}).error && !!A.detectSilence(s,0,{}).error);
console.log('SilenceForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
