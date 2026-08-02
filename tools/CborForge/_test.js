
const fs=require('fs');
const html=fs.readFileSync(__dirname+'/index.html','utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
if(!m){ console.error('no core script'); process.exit(1); }
const P=new Function(m[1]+'\n;return CborForgePure();')();
const assert=require('assert');
// 经典向量：0x9f 01 02 03 ff  => 不定长数组 [1,2,3]
var d1=P.decode(P.bytesFromHex('9f010203ff'));
assert.deepStrictEqual(d1.value,[1,2,3], 'indef array');
// 0xa1 61 61 01  => {"a":1}
var d2=P.decode(P.bytesFromHex('a1616101'));
assert.deepStrictEqual(d2.value,{a:1}, 'map a:1');
// 0x19 03e8 => 1000
var d3=P.decode(P.bytesFromHex('1903e8'));
assert.strictEqual(d3.value,1000, 'uint16 1000');
// 0xf6 => null ; 0xf5 => true
assert.strictEqual(P.decode(P.bytesFromHex('f6')).value,null,'null');
assert.strictEqual(P.decode(P.bytesFromHex('f5')).value,true,'true');
// 0x4401020304 => h'01020304'
var d4=P.decode(P.bytesFromHex('4401020304'));
assert.ok(d4.value && d4.value.__bytes__,'bytes');
assert.strictEqual(P.hex(d4.value.data),'01020304','bytes hex');
// 编码往返：对象 -> hex -> 解码
var enc=P.encode({name:'alice',scores:[1,2,3],ok:true});
var dec=P.decode(enc);
assert.deepStrictEqual(dec.value,{name:'alice',scores:[1,2,3],ok:true},'roundtrip obj');
// 编码 roundtrip：数组
var enc2=P.encode([10,-5,'hi',null]);
var dec2=P.decode(enc2);
assert.deepStrictEqual(dec2.value,[10,-5,'hi',null],'roundtrip arr');
// analyze 结构
var r=P.analyze('a1616101');
assert.ok(!r.error,'analyze no error');
assert.strictEqual(r.total,4,'analyze bytes');
console.log('PASS cbor 8/0');
