
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[];
  function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var sig=Array.from({length:200},function(_,i){return Math.sin(i*0.3);});
  var outArr=A.convolveProcess(sig,[1]);
  var maxd=0; for(var i=0;i<200;i++) maxd=Math.max(maxd, Math.abs(outArr[i]-sig[i]));
  ok('conv dirac identity', maxd<1e-9);
  var ir=A.makeImpulse(3, 4000, 42);
  ok('ir length', ir.length===4000);
  var first10=0,last10=0;
  for(var i=0;i<400;i++) first10+=Math.abs(ir[i]);
  for(var i=3600;i<4000;i++) last10+=Math.abs(ir[i]);
  ok('ir decays', last10 < first10);
  var c=A.convolveAnalyze(sig,{decay:3,len:2000,seed:7});
  ok('conv peak<=1', c.peak<=1+1e-9);
  ok('conv outLen n+m-1', c.outLength===200+2000-1);
  console.log(T.join('\n'));
  console.log('CONVOLVER_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
