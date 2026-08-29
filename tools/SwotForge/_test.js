
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var s=A.swotNotes({topic:'新产品', strengths:'团队强,技术稳', threats:'竞品多'});
  ok('swot topic', s.indexOf('# SWOT 分析 · 新产品')>=0);
  ok('swot 4 sections', s.indexOf('## 优势 Strengths')>=0 && s.indexOf('## 劣势 Weaknesses')>=0 && s.indexOf('## 机会 Opportunities')>=0 && s.indexOf('## 威胁 Threats')>=0);
  ok('swot strengths', s.indexOf('- 团队强')>=0 && s.indexOf('- 技术稳')>=0);
  ok('swot threats', s.indexOf('- 竞品多')>=0);
  ok('swot placeholder', s.indexOf('（待补充）')>=0);
  console.log(T.join('\n'));
  console.log('SWOT_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
