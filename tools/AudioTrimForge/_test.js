
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


function ramp(n){ var a=new Float32Array(n); for(var i=0;i<n;i++) a[i]=i/n; return a; }
(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var sr=8000, arr=ramp(sr*4);
  var o=A.trimSamples(arr, sr, 1, 2);
  ok('trim length', o.length===Math.floor(1*sr));
  ok('trim content', Math.abs(o[0]-arr[sr])<1e-6);
  console.log(T.join('\n'));
  console.log('TRIM_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
