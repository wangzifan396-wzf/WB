
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var e={author:'唐纳德·诺曼', title:'设计心理学', year:'2015', publisher:'中信出版社'};
  var apa=A.bibliography(e,'apa');
  ok('bib apa ok', apa.ok);
  ok('bib apa year', apa.text.indexOf('(2015).')>=0);
  ok('bib apa title', apa.text.indexOf('设计心理学')>=0);
  ok('bib mla quotes', A.bibliography(e,'mla').text.indexOf('"设计心理学."')>=0);
  ok('bib chicago', A.bibliography(e,'chicago').text.indexOf('中信出版社, 2015.')>=0);
  ok('bib gbt', A.bibliography(e,'gbt').text.indexOf('[M].')>=0);
  ok('bib default apa', A.bibliography(e).style==='apa');
  ok('bib empty', A.bibliography({},'apa').ok===false);
  ok('bib url', A.bibliography({title:'X', url:'https://a.com'},'apa').text.indexOf('https://a.com')>=0);
  console.log(T.join('\n'));
  console.log('BIB_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
