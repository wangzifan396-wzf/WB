
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}}; new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;
let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else {fail++;console.error('FAIL '+n);} }
function eq(n,g,e){ const a=JSON.stringify(g),b=JSON.stringify(e);
  if(a===b) pass++; else {fail++;console.error('FAIL '+n+': got '+a+' want '+b);} }

// ---- 整数 ----
eq('int 0', C.toPlain(C.decode('i0e').value), 0);
eq('int pos', C.toPlain(C.decode('i42e').value), 42);
eq('int neg', C.toPlain(C.decode('i-7e').value), -7);
ok('int -0 rejected', /-0/.test(C.decode('i-0e').error));
ok('int leading zero rejected', /前导零/.test(C.decode('i03e').error));
ok('int unterminated', /终止符/.test(C.decode('i42').error));
ok('int non numeric', /非法整数/.test(C.decode('iabce').error));

// ---- 字符串 ----
eq('str', C.toPlain(C.decode('5:hello').value), 'hello');
eq('str empty', C.toPlain(C.decode('0:').value), '');
eq('str utf8', C.toPlain(C.decode('6:\u4e2d\u6587').value), '\u4e2d\u6587');
ok('str overrun', /超出剩余字节/.test(C.decode('9:abc').error));

// ---- 列表 ----
eq('list', C.toPlain(C.decode('l4:spam4:eggse').value), ['spam','eggs']);
eq('list empty', C.toPlain(C.decode('le').value), []);
eq('list nested', C.toPlain(C.decode('lli1ei2eeli3eee').value), [[1,2],[3]]);
ok('list unterminated', /列表缺少/.test(C.decode('l4:spam').error));

// ---- 字典 ----
eq('dict', C.toPlain(C.decode('d3:cow3:moo4:spam4:eggse').value), {cow:'moo',spam:'eggs'});
eq('dict empty', C.toPlain(C.decode('de').value), {});
eq('dict nested', C.toPlain(C.decode('d1:ad1:bi1eee').value), {a:{b:1}});
ok('dict unsorted rejected', /升序/.test(C.decode('d4:spam4:eggs3:cow3:mooe').error));
ok('dict missing value', /缺少值/.test(C.decode('d3:cowe').error));
ok('dict non-str key', /字典键必须/.test(C.decode('di1e3:cowe').error));

// ---- 结构错误 ----
ok('trailing bytes', /未消费/.test(C.decode('i1ei2e').error));
ok('unknown marker', /未知类型/.test(C.decode('x').error));
ok('empty input', C.decode('').error.length>0);

// ---- 真实种子形态 ----
const TOR='d8:announce30:http://tracker.example.com/ann4:infod6:lengthi1024e4:name9:hello.txt12:piece lengthi16384eee';
const t=C.decode(TOR);
eq('torrent ok', t.error, '');
const tp=C.toPlain(t.value);
eq('torrent announce', tp.announce, 'http://tracker.example.com/ann');
eq('torrent name', tp.info.name, 'hello.txt');
eq('torrent length', tp.info.length, 1024);
eq('torrent piece length', tp.info['piece length'], 16384);
const st=C.summary(t.value);
eq('summary dict', st.dict, 2);
eq('summary int', st.int, 2);          // length=1024, piece length=16384
eq('summary str', st.str, 7);          // 5 keys + announce URL + name value

// ---- 二进制降级 ----
const bin=C.decode(new Uint8Array([0x32,0x3a,0x00,0x01]));   // "2:\x00\x01"
ok('binary as hex', /^<hex:0001>$/.test(C.toPlain(bin.value)));

// ---- 编码 ----
eq('enc int', C.encode(42).value, 'i42e');
eq('enc neg', C.encode(-7).value, 'i-7e');
eq('enc str', C.encode('hello').value, '5:hello');
eq('enc utf8 len', C.encode('\u4e2d\u6587').value, '6:\u4e2d\u6587');
eq('enc list', C.encode(['spam','eggs']).value, 'l4:spam4:eggse');
eq('enc dict sorted', C.encode({spam:'eggs',cow:'moo'}).value, 'd3:cow3:moo4:spam4:eggse');
eq('enc nested', C.encode({a:{b:1}}).value, 'd1:ad1:bi1eee');
ok('enc float rejected', /只支持整数/.test(C.encode(1.5).error));
ok('enc null rejected', /不支持的类型/.test(C.encode(null).error));

// ---- 往返 ----
const RT=[42,-1,'x',[],{},['a',['b',1]],{k:[1,2,{z:'q'}]}];
for(const v of RT){
  const e=C.encode(v).value, d=C.toPlain(C.decode(e).value);
  eq('roundtrip '+JSON.stringify(v), d, v);
}
eq('torrent roundtrip', C.encode(tp).value, TOR);

console.log((fail?'FAIL':'PASS')+' BencodeForge  '+pass+' passed / '+fail+' failed');
process.exit(fail?1:0);
