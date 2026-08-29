
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var r=A.withAlpha('#5E6AD2', 0.5);
  ok('opac rgba', r.ok && r.rgba==='rgba(94, 106, 210, 0.5)');
  ok('opac hex8 opaque', A.withAlpha('#5E6AD2', 1).hex8==='#5e6ad2ff');
  ok('opac hex8 transparent', A.withAlpha('#5E6AD2', 0).hex8==='#5e6ad200');
  ok('opac short hex', A.withAlpha('#abc', 1).rgba==='rgba(170, 187, 204, 1)');
  ok('opac bad color', A.withAlpha('zzz', 0.5).ok===false);
  ok('opac bad alpha', A.withAlpha('#fff', 2).ok===false);
  console.log(T.join('\n'));
  console.log('OPAC_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
