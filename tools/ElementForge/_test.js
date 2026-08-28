
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  ok('elem by symbol', A.element('Fe').ok && A.element('Fe').e.z===26);
  ok('elem by name', A.element('金').ok && A.element('金').e.z===79);
  ok('elem by number', A.element(1).ok && A.element(1).e.s==='H');
  ok('elem missing', A.element('Xx').ok===false);
  console.log(T.join('\n'));
  console.log('ELEM_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
