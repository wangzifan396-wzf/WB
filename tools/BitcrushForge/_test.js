
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[];
  function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var sig=Array.from({length:300},function(_,i){return Math.sin(i*0.1);});
  var a=A.bitcrushAnalyze(sig,{bits:8,downsample:1});
  ok('bitcrush length', a.length===300);
  ok('bitcrush distinct<=256', a.distinctLevels<=256);
  ok('bitcrush peak<=1', a.peak<=1+1e-9);
  // bits=1 时只有 2 个电平
  var b1=A.bitcrushAnalyze(sig,{bits:1});
  ok('bitcrush 1bit=2levels', b1.distinctLevels===2);
  // 全零输入量化后（mid-riser 量化器有偏置）幅度有界且确定
  var z=A.bitcrushAnalyze(new Array(40).fill(0),{bits:4});
  ok('bitcrush zero bounded', z.peak<=1+1e-9 && isFinite(z.rms));
  // 恒值信号量化后 distinct=1
  var cst=A.bitcrushAnalyze(new Array(20).fill(0.5),{bits:8});
  ok('bitcrush const 1 level', cst.distinctLevels===1);
  // 降采样比保持长度（hold 模式）
  var ds=A.bitcrushAnalyze(sig,{bits:8,downsample:4});
  ok('bitcrush downsample length kept', ds.length===300);
  console.log(T.join('\n'));
  console.log('BITCRUSH_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
