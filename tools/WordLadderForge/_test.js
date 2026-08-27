
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var a=A.wordLadder('cold','warm'); ok('ladder found', a.ok && a.path[0]==='cold' && a.path[a.path.length-1]==='warm');
  var b=A.wordLadder('cold','cold'); ok('ladder same', b.ok && b.path.length===1);
  var c=A.wordLadder('abc','warm'); ok('ladder length', c.ok===false);
  console.log(T.join('\n'));
  console.log('WL_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
