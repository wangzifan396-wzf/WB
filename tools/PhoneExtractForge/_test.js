
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var a=A.extractPhones('call 13812345678 now 15900001111');
  ok('phone count', a.count===2);
  ok('phone value', a.phones[0]==='13812345678');
  ok('phone unique', A.extractPhones('13812345678 13812345678',{unique:true}).count===1);
  ok('phone valid', A.validPhone('13812345678')===true);
  ok('phone invalid prefix', A.validPhone('12812345678')===false);
  ok('phone invalid len', A.validPhone('1381234567')===false);
  ok('phone mask', A.maskPhone('13812345678')==='138****5678');
  ok('phone mask passthrough', A.maskPhone('abc')==='abc');
  console.log(T.join('\n'));
  console.log('PHONE_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
