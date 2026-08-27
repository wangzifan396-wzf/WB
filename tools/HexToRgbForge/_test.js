
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var a=A.parseColor('#5E6AD2'); ok('hex6 ok', a.ok && a.r===94 && a.g===106 && a.b===210);
  var b=A.parseColor('#abc'); ok('hex3 ok', b.ok && b.r===170 && b.g===187 && b.b===204);
  var d=A.parseColor('rgb(10,20,30)'); ok('rgb ok', d.ok && d.r===10 && d.g===20 && d.b===30);
  var h=A.rgbToHsl(255,0,0); ok('hsl red', h.h===0 && h.s===100);
  console.log(T.join('\n'));
  console.log('COLOR_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
