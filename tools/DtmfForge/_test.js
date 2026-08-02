
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}}; new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;
let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else {fail++;console.error('FAIL '+n);} }
function eq(n,g,e){ if(g===e) pass++; else {fail++;console.error('FAIL '+n+': got '+JSON.stringify(g)+' want '+JSON.stringify(e));} }

eq('enc 1', C.encodeChar('1').low, 697);
eq('enc 1 high', C.encodeChar('1').high, 1209);
eq('enc 5', C.encodeChar('5').low, 770);
eq('enc A high', C.encodeChar('A').high, 1633);
eq('enc D', C.encodeChar('D').low, 941);
{
  const r=C.encode('123');
  eq('enc len', r.value.length, 3);
  eq('enc first low', r.value[0].low, 697);
  eq('enc third high', r.value[2].high, 1477);
}
eq('enc empty', C.encode('').value.length, 0);
ok('enc bad', /非法/.test(C.encode('X').error));

eq('dec 1', C.decode(697,1209).value.key, '1');
eq('dec D', C.decode(941,1633).value.key, 'D');
eq('dec 0', C.decode(941,1336).value.key, '0');
ok('dec bad', /标准集/.test(C.decode(600,1200).error));

eq('detect 1', C.detect(697,1209).value.key, '1');
eq('detect 6', C.detect(770,1477).value.key, '6');
eq('detect hash', C.detect(941,1477).value.key, '#');
ok('detect tol', /偏离/.test(C.detect(697,1450).error));  // 1450 远高于任何高频
ok('detect tol low', /偏离/.test(C.detect(500,1209).error));

// 往返：每个键编→解一致
var all='123A456B789C*0#D';
for(var i=0;i<all.length;i++){
  var k=all[i];
  var e=C.encodeChar(k);
  eq('rt '+k, C.decode(e.low,e.high).value.key, k);
}

// 键盘结构
eq('keypad rows', C.keypad().rows.length, 4);
eq('keypad highs', C.keypad().high.length, 4);

console.log((fail?'FAIL':'PASS')+' DtmfForge  '+pass+' passed / '+fail+' failed');
process.exit(fail?1:0);
