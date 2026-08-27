
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


function mkT(){ return 'A cat sat on the mat. A dog ran in the park. The sun rose slowly over the hills. Birds sang a happy song. We walked home before the rain.'; }
(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var txt=mkT();
  var s=A.summarize(txt,{n:2});
  ok('summarize non-empty', s.length>0);
  ok('summarize subset', txt.indexOf(s.slice(0,10))>=0);
  var all=A.summarize(txt,{n:99});
  ok('summarize cap', all.split(/[.!?]/).filter(function(x){return x.trim();}).length<=5);
  console.log(T.join('\n'));
  console.log('SUMMARIZE_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
