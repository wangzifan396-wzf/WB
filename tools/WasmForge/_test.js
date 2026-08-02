
const fs=require('fs');
const html=fs.readFileSync(__dirname+'/index.html','utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
if(!m){ console.error('no core script'); process.exit(1); }
const P=new Function(m[1]+'\n;return WasmForgePure();')();
const assert=require('assert');

const MAGIC='0061736d01000000';
const ADD=MAGIC+'01070160027f7f017f'+'03020100'+'070701036164640000'+'0a09010700200020016a0b';

// ---------- 输入解码 ----------
assert.deepStrictEqual(P.fromHex('00 61 73 6d'),[0,0x61,0x73,0x6d],'hex with spaces');
assert.deepStrictEqual(P.fromHex('0x000x61'),[0,0x61],'hex with 0x prefix');
assert.strictEqual(P.fromHex('abc'),null,'odd length rejected');
assert.strictEqual(P.fromHex('zz'),null,'non-hex rejected');
assert.strictEqual(P.decodeInput(ADD).encoding,'hex','hex detected');
const b64=Buffer.from(Uint8Array.from(P.fromHex(ADD))).toString('base64');
assert.strictEqual(P.decodeInput(b64).encoding,'base64','base64 detected');
assert.deepStrictEqual(P.decodeInput(b64).bytes,P.fromHex(ADD),'base64 round trip');
assert.ok(P.decodeInput('').error,'empty rejected');
assert.ok(P.decodeInput('这不是模块').error,'garbage rejected');

// ---------- LEB128 ----------
assert.deepStrictEqual(P.readU32([0x05],0),{value:5,next:1},'single byte leb');
assert.deepStrictEqual(P.readU32([0x80,0x01],0),{value:128,next:2},'two byte leb');
assert.deepStrictEqual(P.readU32([0xac,0x02],0),{value:300,next:2},'leb 300');
assert.ok(P.readU32([0x80,0x80,0x80,0x80,0x80,0x80],0).error,'leb too long');
assert.strictEqual(P.valtype(0x7f),'i32'); assert.strictEqual(P.valtype(0x7b),'v128');

// ---------- add 模块 ----------
var a=P.analyze(ADD);
assert.ok(!a.error,'add parsed');
assert.strictEqual(a.version,1,'version 1');
assert.strictEqual(a.size,41,'41 bytes');
assert.strictEqual(a.localFuncs,1,'1 local func');
assert.strictEqual(a.importedFuncs,0,'no imports');
assert.deepStrictEqual(a.types,['(i32, i32) -> i32'],'signature');
assert.strictEqual(a.exports.length,1,'1 export');
assert.strictEqual(a.exports[0].name,'add');
assert.strictEqual(a.exports[0].kind,'函数');
assert.strictEqual(a.exports[0].detail,'(i32, i32) -> i32','export signature resolved');
assert.strictEqual(a.errCount,0,'add module clean');
assert.strictEqual(a.stats.rows.reduce(function(s,r){return s+r.bytes;},0)+8,a.size,'section bytes + header = size');

// ---------- 带导入 / 内存 / name 段 ----------
var RICH=MAGIC+'01070160027f7f017f'+'020b0103656e76036c6f670000'+'03020100'+
         '0503010001'+'070701036164640001'+'0a09010700200020016a0b'+'0005046e616d65';
var r=P.analyze(RICH);
assert.ok(!r.error,'rich parsed');
assert.strictEqual(r.importedFuncs,1,'1 imported func');
assert.strictEqual(r.imports[0].name,'env.log','import name');
assert.strictEqual(r.imports[0].detail,'(i32, i32) -> i32','import signature');
assert.strictEqual(r.memories.length,1,'1 memory');
assert.strictEqual(r.memories[0].min,1,'memory min 1');
assert.strictEqual(r.memories[0].max,null,'memory unbounded');
assert.strictEqual(r.exports[0].detail,'(i32, i32) -> i32','export index skips imported funcs');
assert.strictEqual(r.errCount,0,'rich module clean');
function has(x,re){ return x.issues.some(function(i){ return re.test(i.text); }); }
assert.ok(has(r,/name 自定义段/),'name section hint');
assert.ok(has(r,/未设置上限/),'unbounded memory hint');
assert.ok(has(r,/定义了内存但没有导出/),'memory not exported hint');

// ---------- 体检规则 ----------
assert.ok(has(P.analyze(MAGIC+'050401030102'),/shared 共享内存/),'shared memory');
assert.ok(has(P.analyze(MAGIC+'0504010 0ac02'.replace(/ /g,'')),/初始就申请 300 页/),'huge initial memory');
assert.ok(has(P.analyze(MAGIC+'0105016001'+'7b00'),/SIMD/),'simd detected');
assert.ok(has(P.analyze(MAGIC+'000c0b2e64656275675f696e666f'),/DWARF/),'dwarf section');
assert.ok(has(P.analyze(MAGIC+'0715'+'01'+'11'+'5f5f7762696e6467656e5f6d616c6c6f63'+'0000'),/wasm-bindgen/),'bindgen exports');
assert.ok(has(P.analyze(MAGIC+'0223'+'01'+'16'+'776173695f736e617073686f745f7072657669657731'+'08'+'66645f7772697465'+'0000'),/WASI/),'wasi imports');
assert.ok(has(P.analyze(MAGIC+'01070160027f7f017f'+'03020100'),/代码段却有 0 个函数体/),'func/code mismatch');
assert.ok(has(P.analyze(MAGIC),/既没有导出段也没有起始段/),'unreachable module');
assert.ok(has(P.analyze(MAGIC+'070d02036164640000036164640000'),/导出名重复/),'duplicate export');
assert.ok(has(P.analyze(MAGIC+'070701036164640000'+'01070160027f7f017f'),/段顺序错误/),'section order');

// ---------- 错误处理 ----------
assert.ok(P.analyze('').error,'empty rejected');
assert.ok(/魔数不正确/.test(P.analyze('deadbeef01000000').error),'bad magic');
assert.ok(/至少需要 8 字节/.test(P.analyze('0061736d').error),'too short');
assert.ok(/截断/.test(P.analyze(MAGIC+'010a0160').error),'truncated section');
assert.ok(P.analyze(MAGIC.replace('01000000','02000000')).issues.some(function(i){return /版本号为 2/.test(i.text);}),'bad version');

console.log('PASS wasm 8/0');
