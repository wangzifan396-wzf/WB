
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var c=A.layoutCss('center');
  ok('layout center', c.ok && c.css.indexOf('justify-content:center')>=0);
  ok('layout gap', A.layoutCss('grid',{gap:24}).css.indexOf('gap: 24px')>=0);
  ok('layout holygrail', A.layoutCss('holygrail').name.indexOf('圣杯')>=0);
  ok('layout kids', A.layoutCss('sidebar').kids.join(',')==='aside,main');
  ok('layout unknown', A.layoutCss('nope').ok===false);
  ok('layout default gap', A.layoutCss('stack').css.indexOf('gap: 16px')>=0);
  console.log(T.join('\n'));
  console.log('LAYOUT_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
