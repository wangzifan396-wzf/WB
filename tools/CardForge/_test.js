
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var c=A.cardCss({radius:14, padding:20, shadow:2});
  ok('card radius', c.indexOf('border-radius: 14px;')>=0);
  ok('card padding', c.indexOf('padding: 20px;')>=0);
  ok('card shadow', c.indexOf('box-shadow:')>=0);
  ok('card width', A.cardCss({width:400}).indexOf('width: 400px;')>=0);
  ok('card shadow clamp', A.cardCss({shadow:99}).indexOf('0 16px 40px')>=0);
  ok('card bg', A.cardCss({bg:'#101010'}).indexOf('background: #101010;')>=0);
  console.log(T.join('\n'));
  console.log('CARDF_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
