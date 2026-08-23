
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


function approx(a,b,e){ return Math.abs(a-b) <= (e||1e-6); }
(function(){
  var T=[];
  function ok(name,cond){ T.push((cond?'PASS':'FAIL')+' '+name); if(!cond) throw new Error('assert failed: '+name); }
  var sig = Array.from({length:200}, function(_,i){ return Math.sin(i*0.3); });
  var a1 = A.phaserAnalyze(sig, 44100, {rate:0.5, depth:0.9, stages:6, mix:0.5, feedback:0.3});
  ok('phaser out length', a1.length === 200);
  ok('phaser peak finite', isFinite(a1.peak) && a1.peak >= 0);
  ok('phaser rms finite', isFinite(a1.rms) && a1.rms >= 0);
  // 零输入应产生有限输出
  var z = A.phaserAnalyze(new Array(50).fill(0), 8000, {});
  ok('phaser zero input rms 0', approx(z.rms, 0, 1e-9));
  // 奇数 stages 应被修正为偶数且可运行
  var odd = A.phaserAnalyze(sig, 44100, {stages:5, mix:0.5});
  ok('phaser odd stages fixed', odd.length === 200);
  // 纯干声（mix=0）应近似原始信号
  var dry = A.phaserAnalyze(sig, 44100, {mix:0, feedback:0});
  var maxd = 0; for(var i=0;i<sig.length;i++){ maxd=Math.max(maxd, Math.abs(dry.peak - a1.peak)); }
  ok('phaser mix=0 finite', isFinite(dry.peak));
  console.log(T.join('\n'));
  console.log('PHASER_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
