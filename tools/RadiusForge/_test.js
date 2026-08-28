
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  ok('radius uniform', A.borderRadiusCss(8,8,8,8)==='8px');
  ok('radius mixed', A.borderRadiusCss(8,0,8,0)==='8px 0px 8px 0px');
  ok('radius zero', A.borderRadiusCss(0,0,0,0)==='0px');
  console.log(T.join('\n'));
  console.log('RAD_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
