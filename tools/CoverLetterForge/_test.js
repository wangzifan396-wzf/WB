
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var s=A.coverLetter({name:'李雷', role:'后端', company:'ACME', highlights:'主导项目\n优化性能'});
  ok('cover non-empty', s.length>0);
  ok('cover has name', s.indexOf('李雷')>=0);
  ok('cover has bullet', s.indexOf('• 主导项目')>=0);
  ok('cover has sign', s.split('\n').pop()==='李雷');
  console.log(T.join('\n'));
  console.log('COVER_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
