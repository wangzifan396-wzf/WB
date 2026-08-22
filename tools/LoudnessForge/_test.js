
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var sr=8000, s=[];
for(var i=0;i<8000;i++) s.push(0.5*Math.sin(2*Math.PI*1000*i/sr));
var r=A.analyzeLoudness(s,sr,{targetLufs:-14});
ok('peak', r.peak===0.5 && r.peakDb===-6.02 && r.rmsDb===-9.03);
ok('lufs', r.lufsApprox===-9.72 && r.blocks===7 && r.blocksKept===7 && r.silent===false);
ok('gain', r.suggestedGainDb===-4.28 && r.maxGainBeforeClipDb===6.02 && r.clipped===0 && !r.warning);
var s2=s.map(function(v){return v/2;});
var r2=A.analyzeLoudness(s2,sr,{});
ok('half', r2.lufsApprox===-15.74 && Math.abs((r2.lufsApprox-r.lufsApprox)+6.02)<0.01 && r2.targetLufs===-14);
var r3=A.analyzeLoudness(new Array(8000).fill(0),sr,{});
ok('silent', r3.silent===true && r3.lufsApprox===null && r3.clipped===0 && r3.suggestedGainDb===null);
var sc=s.slice(); sc[10]=1.0; sc[20]=-1.0;
var r4=A.analyzeLoudness(sc,sr,{});
ok('clip', r4.clipped===2 && !!r4.warning && r4.warning.indexOf('削波')>=0);
ok('dbconv', Math.abs(A.dbToAmp(-6)-0.501187)<0.0001 && Math.abs(A.ampToDb(0.5)+6.0206)<0.001 && A.ampToDb(0)===-Infinity);
ok('err', !!A.analyzeLoudness([],sr,{}).error && !!A.analyzeLoudness(s,0,{}).error);
console.log('LoudnessForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
