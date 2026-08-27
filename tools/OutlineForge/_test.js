
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var o=A.outline('alpha\nbeta\ngamma',{max:20});
  ok('outline 3 lines', o.split('\n').length===3);
  ok('outline bullets', o.indexOf('- alpha')===0);
  var h=A.outline('# Title\nbody',{max:20});
  ok('outline keeps heading', h.split('\n')[0]==='# Title');
  console.log(T.join('\n'));
  console.log('OUTLINE_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
