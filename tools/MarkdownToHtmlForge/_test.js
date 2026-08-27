
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var h=A.mdToHtml('# Hi\n- a\n- b\n**x**');
  ok('md h1', h.indexOf('<h1>Hi</h1>')>=0);
  ok('md ul', h.indexOf('<ul>')>=0 && h.indexOf('<li>a</li>')>=0);
  ok('md strong', h.indexOf('<strong>x</strong>')>=0);
  ok('md link', A.mdToHtml('[t](https://x.com)').indexOf('<a href="https://x.com">t</a>')>=0);
  console.log(T.join('\n'));
  console.log('MD2H_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
