
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var c=A.badgeCss({});
  ok('badge radius', c.indexOf('border-radius: 999px;')>=0);
  ok('badge bg', c.indexOf('background: #5E6AD2;')>=0);
  ok('badge padding', c.indexOf('padding: 3px 10px;')>=0);
  ok('badge custom', A.badgeCss({bg:'#101010', color:'#fff', radius:4}).indexOf('border-radius: 4px;')>=0);
  ok('badge inline-flex', c.indexOf('display: inline-flex;')>=0);
  console.log(T.join('\n'));
  console.log('BADGE_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
