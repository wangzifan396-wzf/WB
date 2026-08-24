
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[];
  function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var sig=Array.from({length:400},function(_,i){return Math.sin(i*0.2);});
  var loud=sig.slice(); loud[10]=5;
  var c=A.compressAnalyze(loud,{threshold:-20,ratio:4,makeup:0});
  ok('comp length', c.length===400);
  ok('comp peak finite', isFinite(c.peak)&&c.peak>=0);
  ok('comp maxReduction>0', c.maxReductionDb>0);
  var z=A.compressAnalyze(new Array(50).fill(0),{});
  ok('comp zero rms 0', Math.abs(z.rms)<1e-9);
  var noMk=A.compressAnalyze(loud,{makeup:0});
  var withMk=A.compressAnalyze(loud,{makeup:6});
  ok('comp makeup increases peak', withMk.peak>noMk.peak);
  console.log(T.join('\n'));
  console.log('COMPRESSOR_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
