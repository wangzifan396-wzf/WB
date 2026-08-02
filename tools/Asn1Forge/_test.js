
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}}; new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;
let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else {fail++;console.error('FAIL '+n);} }
function eq(n,g,e){ if(g===e) pass++; else {fail++;console.error('FAIL '+n+': got '+JSON.stringify(g)+' want '+JSON.stringify(e));} }

// ---- OID 解码 ----
eq('oid rsa', C.decodeOid(C.hexToBytes('2a864886f70d010101')), '1.2.840.113549.1.1.1');
eq('oid cn',  C.decodeOid(C.hexToBytes('550403')), '2.5.4.3');
eq('oid ed25519', C.decodeOid(C.hexToBytes('2b6570')), '1.3.101.112');
eq('oid p256', C.decodeOid(C.hexToBytes('2a8648ce3d030107')), '1.2.840.10045.3.1.7');
eq('oid joint 2.100.3', C.decodeOid(C.hexToBytes('813403')), '2.100.3');
eq('oid unterminated', C.decodeOid(C.hexToBytes('2a86')), null);

// ---- 基础 TLV ----
let r=C.parse('0500');
eq('null ok', r.error, '');
eq('null name', r.value.root.name, 'NULL');
eq('null len', r.value.root.length, 0);
eq('null value', r.value.root.value, 'NULL');

r=C.parse('020105');
eq('int name', r.value.root.name, 'INTEGER');
eq('int value', r.value.root.value, '5');
r=C.parse('0201ff');
eq('int -1', r.value.root.value, '-1');
r=C.parse('020200ff');
eq('int 255', r.value.root.value, '255');
r=C.parse('02020100');
eq('int 256', r.value.root.value, '256');
r=C.parse('0201800');   // 奇数 hex 会被截断为 020180
eq('int -128', r.value.root.value, '-128');

r=C.parse('0101ff'); eq('bool TRUE', r.value.root.value, 'TRUE');
r=C.parse('010100'); eq('bool FALSE', r.value.root.value, 'FALSE');

r=C.parse('0c0568656c6c6f');
eq('utf8 name', r.value.root.name, 'UTF8String');
eq('utf8 value', r.value.root.value, 'hello');

// ---- 构造类型 ----
r=C.parse('300d06092a864886f70d0101010500');
eq('seq ok', r.error, '');
eq('seq name', r.value.root.name, 'SEQUENCE');
ok('seq constructed', r.value.root.constructed===true);
eq('seq children', r.value.root.children.length, 2);
eq('child0 oid', r.value.root.children[0].oid, '1.2.840.113549.1.1.1');
ok('child0 label', /rsaEncryption/.test(r.value.root.children[0].value));
eq('child1', r.value.root.children[1].name, 'NULL');
eq('consumed', r.value.consumed, 15);
eq('trailing', r.value.trailing, 0);
eq('flatten count', C.flatten(r.value.root).length, 3);
eq('oidList', C.oidList(r.value.root).join(','), '1.2.840.113549.1.1.1');

// ---- 嵌套 SEQUENCE ----
r=C.parse('3009300702010102010202');   // SEQ{ SEQ{ INT 1, INT 2 } } -- 故意长度不符
ok('length mismatch caught', r.error.length>0);
r=C.parse('30083006020101020102');
eq('nested ok', r.error, '');
eq('nested depth', C.flatten(r.value.root).length, 4);

// ---- 上下文标签 ----
r=C.parse('a003020101');
eq('ctx name', r.value.root.name, '[0]');
eq('ctx cls', r.value.root.cls, 'CONTEXT');
ok('ctx constructed', r.value.root.constructed===true);
eq('ctx child', r.value.root.children[0].value, '1');

// ---- BIT STRING ----
r=C.parse('03020730');
ok('bitstring unused', /未用位 7/.test(r.value.root.value));

// ---- 长格式长度 ----
const long='0481'+'80'+'00'.repeat(128);   // OCTET STRING, 长格式 128 字节
r=C.parse(long);
eq('long form ok', r.error, '');
eq('long form len', r.value.root.length, 128);
r=C.parse('028100'+'05');   // INTEGER 长格式表示长度 0 -> 应告警
ok('non-minimal length warned', r.value.warnings.length>0);

// ---- 错误路径 ----
ok('empty', /输入为空/.test(C.parse('').error));
ok('indefinite BER', /不定长/.test(C.parse('3080050000 00').error));
ok('overrun', /超出剩余/.test(C.parse('0405aabb').error));
ok('truncated len', /意外结束|缺少长度/.test(C.parse('30').error));
ok('len too long', /长度字段过长/.test(C.parse('0485'+'0000000001').error));

// ---- 尾部数据 ----
r=C.parse('0500'+'0500');
eq('trailing detected', r.value.trailing, 2);

// ---- Base64 / PEM 输入 ----
const pem='-----BEGIN X-----\nMA0GCSqGSIb3DQEBAQUA\n-----END X-----';
r=C.parse(pem);
eq('pem ok', r.error, '');
eq('pem oid', r.value.root.children[0].oid, '1.2.840.113549.1.1.1');
eq('b64 bytes', C.toHex(C.b64ToBytes('MA0=')), '300d');

console.log((fail?'FAIL':'PASS')+' Asn1Forge  '+pass+' passed / '+fail+' failed');
process.exit(fail?1:0);
