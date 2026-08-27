
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var p=A.proverb({seed:3});
  ok('proverb has text', p.text.length>0);
  ok('proverb has meaning', p.meaning.length>0);
  var p2=A.proverb({seed:3});
  ok('proverb deterministic', JSON.stringify(p2)===JSON.stringify(p));
  var cat=A.proverb({seed:1, cat:'坚持'});
  ok('proverb cat filter', cat.cat==='坚持');
  console.log(T.join('\n'));
  console.log('PROV_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
