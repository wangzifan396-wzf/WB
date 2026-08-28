
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var lin=A.spacingScale({mode:'linear', base:4, steps:3});
  ok('spacing linear', lin==='--space-1: 4px;\n--space-2: 8px;\n--space-3: 12px;');
  var pre=A.spacingScale({mode:'preset', steps:3});
  ok('spacing preset', pre==='--space-1: 2px;\n--space-2: 4px;\n--space-3: 8px;');
  ok('spacing clamp', A.spacingScale({mode:'preset', steps:99}).split('\n').length===10);
  console.log(T.join('\n'));
  console.log('SPACING_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
