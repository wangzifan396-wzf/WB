
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}}; new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;
let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else {fail++;console.error('FAIL '+n);} }
function eq(n,g,e){ if(g===e) pass++; else {fail++;console.error('FAIL '+n+': got '+JSON.stringify(g)+' want '+JSON.stringify(e));} }
const S=s=>C.toBytes(s);
const str=b=>C.fromBytes(b);

// ---- UTF-8 编解码 ----
eq('utf8 ascii', S('AB').join(','), '65,66');
eq('utf8 cjk len', S('中').length, 3);
eq('utf8 emoji len', S('😀').length, 4);
eq('utf8 roundtrip cjk', str(S('中文 abc')), '中文 abc');
eq('utf8 roundtrip emoji', str(S('a😀b')), 'a😀b');

// ---- BWT 教科书向量 ----
{
  const t=C.bwt(S('banana'));
  eq('bwt banana', str(t.last), 'nnbaaa');
  eq('bwt banana index', t.index, 3);
  eq('ibwt banana', str(C.ibwt(t.last, t.index)), 'banana');
}
{
  const t=C.bwt(S('^BANANA'));
  eq('bwt BANANA', str(t.last), 'BNN^AAA');
  eq('ibwt BANANA', str(C.ibwt(t.last, t.index)), '^BANANA');
}
eq('bwt empty last', C.bwt([]).last.length, 0);
eq('bwt empty index', C.bwt([]).index, 0);
eq('ibwt empty', C.ibwt([],0).length, 0);
eq('ibwt bad index', C.ibwt([1,2],5), null);
{
  const t=C.bwt(S('a'));
  eq('bwt single', str(t.last), 'a');
  eq('ibwt single', str(C.ibwt(t.last,t.index)), 'a');
}
{
  const t=C.bwt(S('aaaa'));
  eq('bwt repeat', str(t.last), 'aaaa');
  eq('ibwt repeat', str(C.ibwt(t.last,t.index)), 'aaaa');
}

// BWT 往返：随机与结构化样本
{
  const cases=['mississippi','abracadabra','the quick brown fox jumps over the lazy dog',
               'aaaaaaaabbbbbbbbcccccccc','1234567890','中文测试中文测试','\t\n space  mix ',
               'x'.repeat(100), 'ababababababab'];
  for(const s of cases){
    const t=C.bwt(S(s));
    eq('bwt rt "'+s.slice(0,12)+'"', str(C.ibwt(t.last,t.index)), s);
  }
}
{
  // 伪随机串
  let seed=12345, s='';
  for(let i=0;i<300;i++){ seed=(seed*1103515245+12345)&0x7fffffff; s+=String.fromCharCode(97+(seed%26)); }
  const t=C.bwt(S(s));
  eq('bwt rt random300', str(C.ibwt(t.last,t.index)), s);
}

// ---- MTF ----
eq('mtf abc', C.mtf([97,98,99]).join(','), '97,98,99');
eq('mtf repeat', C.mtf([97,97,97]).join(','), '97,0,0');
eq('mtf alt', C.mtf([97,98,97,98]).join(','), '97,98,1,1');
eq('imtf roundtrip', C.imtf(C.mtf([1,2,3,3,2,1])).join(','), '1,2,3,3,2,1');
eq('imtf bad', C.imtf([300]), null);
{
  const bytes=S('nnbaaa');
  eq('mtf of bwt', C.imtf(C.mtf(bytes)).join(','), bytes.join(','));
}

// ---- RLE ----
eq('rle basic', JSON.stringify(C.rle([0,0,0,1,2,2])), '[[0,3],[1,1],[2,2]]');
eq('rle empty', C.rle([]).length, 0);
eq('irle roundtrip', C.irle(C.rle([5,5,5,7,7,1])).join(','), '5,5,5,7,7,1');
eq('irle from pairs', C.irle([[9,2]]).join(','), '9,9');

// ---- 统计 ----
eq('entropy uniform2', C.entropy([0,1]), 1);
eq('entropy const', C.entropy([7,7,7,7]), 0);
eq('entropy empty', C.entropy([]), 0);
eq('runs', C.runs([1,1,2,2,3]), 3);
eq('runs empty', C.runs([]), 0);
eq('runs single', C.runs([4]), 1);

// ---- 完整管线 ----
{
  const r=C.pipeline('banana banana banana');
  eq('pipeline ok', r.error, '');
  ok('pipeline lossless', r.value.lossless===true);
  eq('pipeline restored', r.value.restored, 'banana banana banana');
  eq('pipeline n', r.value.n, 20);
  ok('pipeline bwt fewer runs', r.value.stats.bwtRuns < r.value.stats.srcRuns);
  ok('pipeline mtf zeros', r.value.stats.mtfZeros > 0);
  ok('pipeline rle shrinks', r.value.stats.rlePairs < r.value.mtf.length);
}
{
  const r=C.pipeline('中文测试 with mixed 内容 123');
  ok('pipeline utf8 lossless', r.value.lossless===true);
  eq('pipeline utf8 restored', r.value.restored, '中文测试 with mixed 内容 123');
}
{
  const r=C.pipeline('a');
  ok('pipeline single lossless', r.value.lossless===true);
  eq('pipeline single n', r.value.n, 1);
}
{
  // 高度重复的输入：MTF 零占比应该很高
  const r=C.pipeline('abc'.repeat(60));
  ok('repetitive zeros high', r.value.stats.mtfZeroPct > 90);
  ok('repetitive lossless', r.value.lossless===true);
}
ok('pipeline empty', /输入为空/.test(C.pipeline('').error));
ok('pipeline too long', /超过上限/.test(C.pipeline('x'.repeat(5000)).error));

// ---- preview ----
eq('preview printable', C.preview(S('abc')), 'abc');
eq('preview control', C.preview([0,9,65]), '··A');
ok('preview truncates', /…$/.test(C.preview(S('x'.repeat(200)))));

console.log((fail?'FAIL':'PASS')+' BwtForge  '+pass+' passed / '+fail+' failed');
process.exit(fail?1:0);
