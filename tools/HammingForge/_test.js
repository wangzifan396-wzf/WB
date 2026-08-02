
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}}; new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;
let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else {fail++;console.error('FAIL '+n);} }
function eq(n,g,e){ if(g===e) pass++; else {fail++;console.error('FAIL '+n+': got '+JSON.stringify(g)+' want '+JSON.stringify(e));} }

// ---- 参数计算 ----
eq('parity k=4', C.parityCount(4), 3);
eq('parity k=11', C.parityCount(11), 4);
eq('parity k=26', C.parityCount(26), 5);
eq('parity k=1', C.parityCount(1), 2);
ok('isPow2 1', C.isPow2(1));
ok('isPow2 8', C.isPow2(8));
ok('not pow2 6', !C.isPow2(6));

// ---- Hamming(7,4) 教科书向量 ----
let e=C.encode('1011');
eq('h74 code', e.value.code, '0110011');
eq('h74 n', e.value.n, 7);
eq('h74 k', e.value.k, 4);
eq('h74 scheme', e.value.scheme, 'Hamming(7,4)');
eq('h74 parities', e.value.parities.length, 3);
eq('h74 p1 covers', e.value.parities[0].covers.join(','), '3,5,7');
eq('h74 p2 covers', e.value.parities[1].covers.join(','), '3,6,7');
eq('h74 p4 covers', e.value.parities[2].covers.join(','), '5,6,7');
eq('h74 all-zero', C.encode('0000').value.code, '0000000');
eq('h74 all-one', C.encode('1111').value.code, '1111111');
eq('h74 1000', C.encode('1000').value.code, '1110000');

// 无错解码
let d=C.decode('0110011');
eq('dec clean syn', d.value.syndrome, 0);
eq('dec clean status', d.value.status, '无错误');
eq('dec clean data', d.value.data, '1011');
eq('dec k', d.value.k, 4);

// 单比特错：逐位翻转都应被定位并纠正
for(let p=1;p<=7;p++){
  const bad=C.flip('0110011', p);
  const r=C.decode(bad);
  eq('flip '+p+' pos', r.value.errorPos, p);
  eq('flip '+p+' data', r.value.data, '1011');
  eq('flip '+p+' corrected', r.value.corrected, '0110011');
}

// ---- Hamming(15,11) ----
e=C.encode('10110101101');
eq('h1511 n', e.value.n, 15);
eq('h1511 k', e.value.k, 11);
eq('h1511 scheme', e.value.scheme, 'Hamming(15,11)');
{
  const cw=e.value.code;
  eq('h1511 clean', C.decode(cw).value.data, '10110101101');
  for(const p of [1,2,4,8,15,7]){
    const r=C.decode(C.flip(cw,p));
    eq('h1511 flip '+p, r.value.errorPos, p);
    eq('h1511 flip '+p+' data', r.value.data, '10110101101');
  }
}

// ---- 扩展 SECDED ----
e=C.encode('1011', true);
eq('ext len', e.value.code.length, 8);
eq('ext scheme', e.value.scheme, 'Extended Hamming(8,4) SECDED');
eq('ext code', e.value.code, '00110011');
{
  const cw=e.value.code;
  let r=C.decode(cw, true);
  eq('ext clean', r.value.status, '无错误');
  eq('ext clean data', r.value.data, '1011');

  // 单错（翻转数据区第 3 位，即整体第 4 位）
  r=C.decode(C.flip(cw,4), true);
  eq('ext single status', r.value.status, '检出 1 位错误，已纠正');
  eq('ext single data', r.value.data, '1011');

  // P0 自身出错
  r=C.decode(C.flip(cw,1), true);
  eq('ext p0 status', r.value.status, '总校验位 P0 自身出错，数据可用');
  eq('ext p0 data', r.value.data, '1011');

  // 双错不可纠
  let two=C.flip(C.flip(cw,3),5);
  r=C.decode(two, true);
  eq('ext double status', r.value.status, '检出 2 位错误，无法纠正');
  ok('ext double flag', r.value.uncorrectable===true);
  eq('ext double data', r.value.data, null);
}

// ---- 非扩展码遇双错会误纠（教科书性质，验证不会崩） ----
{
  const cw='0110011';
  const two=C.flip(C.flip(cw,2),5);
  const r=C.decode(two);
  ok('plain double detected', r.value.syndrome!==0);
  ok('plain double no crash', typeof r.value.data==='string');
}

// ---- 文本 <-> 位 ----
eq('textToBits A', C.textToBits('A'), '01000001');
eq('bitsToText', C.bitsToText('0100000101000010'), 'AB');
eq('roundtrip text', C.bitsToText(C.decode(C.encode(C.textToBits('Hi')).value.code).value.data), 'Hi');

// ---- 开销 ----
eq('overhead k=4', C.overhead(4).n, 7);
eq('overhead k=4 pct', C.overhead(4).percent, 75);
eq('overhead k=11 pct', C.overhead(11).percent, 36.4);
eq('overhead ext k=4', C.overhead(4,true).n, 8);

// ---- 输入清洗与错误 ----
eq('sanitize input', C.encode('1 0 1 1').value.code, '0110011');
eq('sanitize letters', C.encode('a1b0c1d1').value.code, '0110011');
ok('empty data', /数据位为空/.test(C.encode('xyz').error));
ok('too many', /上限 64/.test(C.encode('1'.repeat(65)).error));
ok('empty code', /码字为空/.test(C.decode('').error));
eq('flip out of range', C.flip('0110011', 99), '0110011');
eq('flip idempotent', C.flip(C.flip('0110011',3),3), '0110011');

console.log((fail?'FAIL':'PASS')+' HammingForge  '+pass+' passed / '+fail+' failed');
process.exit(fail?1:0);
