
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var s=A.cheatSheet({topic:'Git', items:'clone: 克隆仓库\ncommit: 提交改动'});
  ok('cheat title', s.indexOf('# Git 速查表')>=0);
  ok('cheat header', s.indexOf('| 语法/概念 | 说明 |')>=0);
  ok('cheat row1', s.indexOf('| `clone` | 克隆仓库 |')>=0);
  ok('cheat row2', s.indexOf('| `commit` | 提交改动 |')>=0);
  ok('cheat no desc', A.cheatSheet({items:'push'}).indexOf('（待补充）')>=0);
  ok('cheat empty placeholder', A.cheatSheet({}).indexOf('| `____` |')>=0);
  console.log(T.join('\n'));
  console.log('CHEAT_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
