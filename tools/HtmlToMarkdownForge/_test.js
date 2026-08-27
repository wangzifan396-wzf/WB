
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var m=A.htmlToMd('<h1>Hi</h1><p>Hello <strong>world</strong></p>');
  ok('h2m h1', m.indexOf('# Hi')>=0);
  ok('h2m strong', m.indexOf('**world**')>=0);
  ok('h2m link', A.htmlToMd('<a href="https://x.com">t</a>').indexOf('[t](https://x.com)')>=0);
  ok('h2m list', A.htmlToMd('<ul><li>a</li><li>b</li></ul>').indexOf('- a')>=0);
  console.log(T.join('\n'));
  console.log('H2M_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
