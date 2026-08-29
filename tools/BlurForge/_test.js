
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var c=A.glassCss({blur:12, radius:16, alpha:0.18, saturate:160});
  ok('blur value', c.indexOf('blur(12px)')>=0);
  ok('blur saturate', c.indexOf('saturate(160%)')>=0);
  ok('blur radius', c.indexOf('border-radius: 16px;')>=0);
  ok('blur alpha', c.indexOf('rgba(255, 255, 255, 0.18)')>=0);
  ok('blur prefix', c.indexOf('-webkit-backdrop-filter')>=0);
  console.log(T.join('\n'));
  console.log('BLUR_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
