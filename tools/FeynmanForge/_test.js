
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var s=A.feynmanNotes({topic:'闭包', points:'函数\n作用域'});
  ok('feyn topic', s.indexOf('# 费曼笔记 · 闭包')>=0);
  ok('feyn 4 sections', s.indexOf('## 1.')>=0 && s.indexOf('## 2.')>=0 && s.indexOf('## 3.')>=0 && s.indexOf('## 4.')>=0);
  ok('feyn points', s.indexOf('- 函数')>=0 && s.indexOf('- 作用域')>=0);
  ok('feyn placeholder', A.feynmanNotes({}).indexOf('（列出构成这个概念的关键要素）')>=0);
  console.log(T.join('\n'));
  console.log('FEYN_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
