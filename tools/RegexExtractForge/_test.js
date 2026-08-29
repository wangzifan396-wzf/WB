
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var e=A.regexExtract('mail a@b.com and c@d.org end', {pattern:A.REGEX_PRESETS.email});
  ok('rx email count', e.ok && e.count===2);
  ok('rx email value', e.matches[0]==='a@b.com');
  var d=A.regexExtract('a1b22c333', {pattern:'\\d+'});
  ok('rx digits', d.matches.join(',')==='1,22,333');
  ok('rx bad regex', A.regexExtract('x', {pattern:'('}).ok===false);
  ok('rx no match', A.regexExtract('abc', {pattern:'\\d'}).count===0);
  var u=A.regexExtract('see https://x.com/a ok', {pattern:A.REGEX_PRESETS.url});
  ok('rx url', u.count===1 && u.matches[0]==='https://x.com/a');
  console.log(T.join('\n'));
  console.log('RX_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
