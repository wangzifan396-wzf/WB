
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var s=A.genName({seed:7, n:5});
  ok('name 5 lines', s.split('\n').length===5);
  ok('name format', /^[A-Za-z]+ [A-Za-z]+$/.test(s.split('\n')[0]));
  ok('name deterministic', A.genName({seed:7, n:5})===s);
  console.log(T.join('\n'));
  console.log('NAME_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
