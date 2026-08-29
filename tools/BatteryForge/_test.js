
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var a=A.batteryLife({capacity:3000, draw:150, efficiency:1});
  ok('batt hours', a.ok && a.hours===20);
  ok('batt days', a.days===20/24);
  var b=A.batteryLife({capacity:3000, draw:150, efficiency:0.85});
  ok('batt eff', Math.abs(b.hours-17)<1e-9);
  var c=A.batteryLife({capacity:3000, voltage:3.7, draw:150});
  ok('batt wh', Math.abs(c.wh-11.1)<1e-9);
  ok('batt bad cap', A.batteryLife({capacity:0, draw:150}).ok===false);
  ok('batt bad draw', A.batteryLife({capacity:3000, draw:0}).ok===false);
  ok('batt bad volt', A.batteryLife({capacity:3000, voltage:0, draw:150}).ok===false);
  console.log(T.join('\n'));
  console.log('BATT_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
