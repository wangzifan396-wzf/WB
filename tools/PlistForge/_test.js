
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}}; new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;
let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else {fail++;console.error('FAIL '+n);} }
function eq(n,g,e){ if(g===e) pass++; else {fail++;console.error('FAIL '+n+': got '+JSON.stringify(g)+' want '+JSON.stringify(e));} }
const BIN='62706c6973743030d90102030405060708090a0b0c10111415161754626c6f6255636f756e74546c697374546e616d65566e6573746564536f6666526f6b527069547768656e430102ff1007a30d0e0f100110021003546e616e6fd11213546465657053796573080923400c0000000000003341c2cf4ec0000000081b20262b30373b3e41464a4c505254565b5e6367686972000000000000010100000000000000180000000000000000000000000000007b';
const XML="<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<!DOCTYPE plist PUBLIC \"-//Apple//DTD PLIST 1.0//EN\" \"http://www.apple.com/DTDs/PropertyList-1.0.dtd\">\n<plist version=\"1.0\">\n<dict>\n\t<key>count</key>\n\t<integer>7</integer>\n\t<key>list</key>\n\t<array>\n\t\t<string>a</string>\n\t\t<string>b</string>\n\t</array>\n\t<key>name</key>\n\t<string>nano &amp; co</string>\n\t<key>nested</key>\n\t<dict>\n\t\t<key>deep</key>\n\t\t<string>yes</string>\n\t</dict>\n\t<key>ok</key>\n\t<true/>\n\t<key>pi</key>\n\t<real>3.5</real>\n</dict>\n</plist>\n";

// ---- 二进制 plist ----
let r=C.parse(BIN);
eq('bin ok', r.error, '');
eq('bin format', r.value.format, 'binary');
eq('bin version', r.value.version, '00');
eq('bin root type', r.value.root.type, 'dict');
eq('bin refsize', r.value.objectRefSize, 1);
let j=C.toJson(r.value.root);
eq('bin name', j.name, 'nano');
eq('bin count', j.count, 7);
eq('bin ok flag', j.ok, true);
eq('bin off flag', j.off, false);
eq('bin pi', j.pi, 3.5);
eq('bin list', JSON.stringify(j.list), '[1,2,3]');
eq('bin blob', j.blob, '0102ff');
eq('bin nested', j.nested.deep, 'yes');
ok('bin date iso', /^2021-01-01T00:00:00Z$/.test(j.when));
eq('bin no warnings', r.value.warnings.length, 0);
ok('bin nodes', C.countNodes(r.value.root) >= 13);

// 键序（plistlib sort_keys=True）
const keys = r.value.root.value.map(e=>e.key);
eq('bin key order', keys.join(','), 'blob,count,list,name,nested,off,ok,pi,when');

// data 节点元信息
const blobNode = r.value.root.value.find(e=>e.key==='blob').value;
eq('data type', blobNode.type, 'data');
eq('data bytes', blobNode.bytes, 3);

// ---- Base64 输入等价 ----
{
  const b = C.hexToBytes(BIN);
  let bin=''; for(const x of b) bin+=String.fromCharCode(x);
  const b64 = Buffer.from(b).toString('base64');
  const r2 = C.parse(b64);
  eq('b64 input ok', r2.error, '');
  eq('b64 same name', C.toJson(r2.value.root).name, 'nano');
}

// ---- XML plist ----
let rx=C.parse(XML);
eq('xml ok', rx.error, '');
eq('xml format', rx.value.format, 'xml');
let jx=C.toJson(rx.value.root);
eq('xml name entity', jx.name, 'nano & co');
eq('xml count', jx.count, 7);
eq('xml pi', jx.pi, 3.5);
eq('xml ok flag', jx.ok, true);
eq('xml list', JSON.stringify(jx.list), '["a","b"]');
eq('xml nested', jx.nested.deep, 'yes');
eq('xml no warn', rx.value.warnings.length, 0);

// XML 标量与 data
{
  const x='<plist version="1.0"><dict><key>d</key><data>AQL/</data><key>t</key><date>2021-01-01T00:00:00Z</date><key>f</key><false/></dict></plist>';
  const rr=C.parse(x); const jj=C.toJson(rr.value.root);
  eq('xml data hex', jj.d, '0102ff');
  eq('xml date', jj.t, '2021-01-01T00:00:00Z');
  eq('xml false', jj.f, false);
}
// XML 数组根
{
  const rr=C.parse('<plist version="1.0"><array><integer>1</integer><integer>2</integer></array></plist>');
  eq('xml array root', rr.value.root.type, 'array');
  eq('xml array json', JSON.stringify(C.toJson(rr.value.root)), '[1,2]');
}
// XML 转义
{
  const rr=C.parse('<plist><dict><key>a&amp;b</key><string>&lt;x&gt; &quot;q&quot;</string></dict></plist>');
  const jj=C.toJson(rr.value.root);
  eq('xml key entity', Object.keys(jj)[0], 'a&b');
  eq('xml val entity', jj['a&b'], '<x> "q"');
}
// XML 无 key 的值 → 告警
{
  const rr=C.parse('<plist><dict><string>x</string></dict></plist>');
  ok('xml orphan value warn', rr.value.warnings.some(w=>/无 <key>/.test(w)));
}
// XML 标签不匹配 → 告警
{
  const rr=C.parse('<plist><dict><key>a</key><string>x</integer></dict></plist>');
  ok('xml mismatch warn', rr.value.warnings.some(w=>/标签不匹配/.test(w)));
}

// ---- 错误路径 ----
ok('empty', /输入为空/.test(C.parse('').error));
ok('not plist', /无法识别|魔数/.test(C.parse('deadbeefdeadbeef').error));
ok('short bin', /文件过短|无法识别/.test(C.parse('62706c6973743030').error));
{
  // 篡改 offsetIntSize 为 0
  const arr=BIN.match(/../g); arr[arr.length-32+6]='00';
  ok('bad offsetIntSize', /offsetIntSize/.test(C.parse(arr.join('')).error));
}
{
  // topObject 越界
  const arr=BIN.match(/../g); arr[arr.length-32+23]='ff';
  ok('topObject oob', /topObject/.test(C.parse(arr.join('')).error));
}
{
  // 偏移表越界
  const arr=BIN.match(/../g); arr[arr.length-32+31]='ff';
  ok('offset table oob', /偏移表越界|对象 #/.test(C.parse(arr.join('')).error));
}
ok('xml no root', /未找到根节点/.test(C.parse('<plist version="1.0"></plist>').error));

// ---- 辅助 ----
eq('appleDate epoch', C.appleDate(0), '2001-01-01T00:00:00Z');
eq('toHex', C.toHex(new Uint8Array([1,255])), '01ff');
eq('b64ToBytes', C.toHex(C.b64ToBytes('AQL/')), '0102ff');
{
  const L=C.lines(r.value.root,null,0);
  ok('lines root', /\{ 9 项 \}/.test(L[0]));
  ok('lines has type', L.some(x=>/\(string\)/.test(x)));
}

console.log((fail?'FAIL':'PASS')+' PlistForge  '+pass+' passed / '+fail+' failed');
process.exit(fail?1:0);
