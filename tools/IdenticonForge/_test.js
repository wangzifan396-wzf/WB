
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var g=A.identiconGrid('guest');
  ok('ident grid 5 rows', g.grid.length===5);
  ok('ident half cols', g.grid[0].length===3);
  ok('ident hue range', g.hue>=0 && g.hue<360);
  var g2=A.identiconGrid('guest');
  ok('ident deterministic', JSON.stringify(g2)===JSON.stringify(g));
  console.log(T.join('\n'));
  console.log('IDENT_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
