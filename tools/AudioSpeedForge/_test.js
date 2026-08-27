
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


function ramp(n){ var a=new Float32Array(n); for(var i=0;i<n;i++) a[i]=i/n; return a; }
(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var arr=ramp(1000);
  var fast=A.speedSamples(arr, 8000, 2);
  ok('speed length ~half', Math.abs(fast.length-500)<=1);
  var slow=A.speedSamples(arr, 8000, 0.5);
  ok('speed length ~double', Math.abs(slow.length-2000)<=1);
  console.log(T.join('\n'));
  console.log('SPEED_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
