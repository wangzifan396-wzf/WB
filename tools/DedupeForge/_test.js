
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  ok('dedupe basic', A.dedupeLines('a\nb\na')==='a\nb');
  ok('dedupe ignoreCase', A.dedupeLines('A\na',{ignoreCase:true})==='A');
  ok('dedupe trimWs', A.dedupeLines(' a\na ',{trimWs:true})===' a');
  ok('dedupe keeps order', A.dedupeLines('c\na\nc\nb')==='c\na\nb');
  console.log(T.join('\n'));
  console.log('DEDUPE_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
