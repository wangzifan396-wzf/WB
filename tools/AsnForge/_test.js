
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var r1=A.parseAsn('AS13335');
  ok('asn valid', r1.valid===true);
  ok('asn num', r1.num===13335);
  ok('asn asdot', r1.asdot==='AS13335');
  ok('asn 16bit', r1.kind==='16-bit');
  ok('asn not reserved', r1.reserved===false);
  var r2=A.parseAsn('65000');
  ok('asn private reserved', r2.reserved===true && r2.note.indexOf('私有')>=0);
  var r3=A.parseAsn('4200000001');
  ok('asn 32bit', r3.kind==='32-bit');
  ok('asn 32bit private', r3.reserved===true);
  ok('asn bad', A.parseAsn('xyz').valid===false);
  ok('asn empty', A.parseAsn('').valid===false);
  console.log(T.join('\n'));
  console.log('ASN_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
