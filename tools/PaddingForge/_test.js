
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  ok('pad all', A.boxSpacing({top:16,right:16,bottom:16,left:16}).css==='padding: 16px;');
  ok('pad 2-value', A.boxSpacing({top:8,right:16,bottom:8,left:16}).css==='padding: 8px 16px;');
  ok('pad 3-value', A.boxSpacing({top:8,right:16,bottom:24,left:16}).css==='padding: 8px 16px 24px;');
  ok('pad 4-value', A.boxSpacing({top:1,right:2,bottom:3,left:4}).css==='padding: 1px 2px 3px 4px;');
  ok('pad margin prop', A.boxSpacing({property:'margin',top:4,right:4,bottom:4,left:4}).css==='margin: 4px;');
  console.log(T.join('\n'));
  console.log('PAD_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
