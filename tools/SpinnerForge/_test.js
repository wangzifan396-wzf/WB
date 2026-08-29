
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var r=A.spinnerCss('ring');
  ok('spin ring', r.ok && r.css.indexOf('rotate(360deg)')>=0);
  ok('spin name', r.name==='旋转圆环');
  ok('spin size', A.spinnerCss('ring',{size:48}).css.indexOf('width:48px')>=0);
  ok('spin color', A.spinnerCss('ring',{color:'#ff0000'}).css.indexOf('#ff0000')>=0);
  ok('spin dots kids', A.spinnerCss('dots').kids===3);
  ok('spin dots css', A.spinnerCss('dots').css.indexOf('nth-child(3)')>=0);
  ok('spin pulse', A.spinnerCss('pulse').css.indexOf('spinner-pulse')>=0);
  ok('spin unknown', A.spinnerCss('nope').ok===false);
  console.log(T.join('\n'));
  console.log('SPIN_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
