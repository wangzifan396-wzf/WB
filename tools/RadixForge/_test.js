
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var a=A.radixConvert('FF',16,10); ok('hex->dec', a.ok && a.value==='255');
  var b=A.radixConvert('255',10,2); ok('dec->bin', b.ok && b.value==='11111111');
  var c=A.radixConvert('ZZ',36,10); ok('base36', c.ok && c.value==='1295');
  var d=A.radixConvert('GG',16,10); ok('bad hex', d.ok===false);
  console.log(T.join('\n'));
  console.log('RADIX_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
