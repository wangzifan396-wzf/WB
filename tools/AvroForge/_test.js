
const fs = require('fs');
const assert = require('assert');
const html = fs.readFileSync(__dirname + '/index.html', 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
const P = new Function(m[1] + '\n;return AvroForgePure();')();

let pass = 0, fail = 0;
function t(name, fn){ try { fn(); pass++; } catch (e){ fail++; console.log('FAIL ' + name + ': ' + e.message); } }
function has(list, re){ return list.some(function(x){ return re.test(x.text); }); }

// 1. Avro 规范给出的基元 Rabin 64 指纹标准值
t('primitive fingerprints match Avro spec', function(){
  const KNOWN = {
    'null':    '7195948357588979594',
    'boolean': '-6970731678124411036',
    'int':     '8247732601305521295',
    'long':    '-3434872931120570953',
    'float':   '5583340709985441680',
    'double':  '-8181574048448539266',
    'bytes':   '5746618253357095269',
    'string':  '-8142146995180207161'
  };
  Object.keys(KNOWN).forEach(function(k){
    const fp = P.fingerprint64('"' + k + '"');
    assert.strictEqual(P.fpSigned(fp).toString(), KNOWN[k], k + ' fingerprint');
  });
});

// 2. 解析规范形式：剥掉 doc / default，展开成全名，字段只留 name 与 type
t('canonical form strips doc and expands namespace', function(){
  const r = P.analyze(JSON.stringify({
    type: 'record', name: 'User', namespace: 'com.x', doc: '用户',
    fields: [
      {name: 'id', type: 'long', doc: '主键'},
      {name: 'name', type: ['null', 'string'], 'default': null}
    ]
  }));
  assert.ok(!r.error, 'no parse error');
  assert.strictEqual(r.canonical,
    '{"name":"com.x.User","type":"record","fields":[{"name":"id","type":"long"},{"name":"name","type":["null","string"]}]}');
  assert.strictEqual(r.rootName, 'com.x.User');
  assert.strictEqual(r.fingerprintHex.length, 16, 'fp is 16 hex chars');
});

// 3. 单对象编码头 = C3 01 + 小端 8 字节指纹
t('single object header is C3 01 plus little endian fp', function(){
  const r = P.analyze('"string"');
  const parts = r.singleObject.split(' ');
  assert.strictEqual(parts.length, 10);
  assert.strictEqual(parts[0], 'c3');
  assert.strictEqual(parts[1], '01');
  assert.strictEqual(parts.slice(2).reverse().join(''), r.fingerprintHex, 'little endian of fp');
});

// 4. 结构校验：重名类型 / 未知引用 / enum 符号非法 / fixed 缺 size
t('structural errors are reported', function(){
  const dup = P.analyze(JSON.stringify({
    type: 'record', name: 'A', fields: [{name: 'x', type: {type: 'record', name: 'A', fields: []}}]
  }));
  assert.ok(dup.errCount > 0, 'duplicate name is an error');

  const ref = P.analyze(JSON.stringify({type: 'record', name: 'A', fields: [{name: 'x', type: 'Nope'}]}));
  assert.ok(ref.errCount > 0, 'unknown reference is an error');

  const en = P.analyze(JSON.stringify({type: 'enum', name: 'E', symbols: ['ok', '1bad']}));
  assert.ok(en.errCount > 0, 'bad enum symbol');

  const fx = P.analyze(JSON.stringify({type: 'fixed', name: 'F'}));
  assert.ok(fx.errCount > 0, 'fixed missing size');
});

// 5. 逻辑类型：scale 不得大于 precision，底层类型必须匹配
t('logical type validation', function(){
  const bad = P.analyze(JSON.stringify({type: 'bytes', logicalType: 'decimal', precision: 2, scale: 5}));
  assert.ok(bad.errCount > 0 || bad.warnCount > 0, 'scale greater than precision');

  const wrong = P.analyze(JSON.stringify({type: 'string', logicalType: 'date'}));
  assert.ok(wrong.errCount > 0 || wrong.warnCount > 0, 'date must sit on int');

  const good = P.analyze(JSON.stringify({type: 'long', logicalType: 'timestamp-micros'}));
  assert.strictEqual(good.errCount, 0, 'valid logical type is clean');
});

// 6. 演进兼容：可选字段 / 必填字段 / 改类型 / 类型提升
t('schema evolution verdicts', function(){
  const v1 = JSON.stringify({type: 'record', name: 'U', fields: [{name: 'id', type: 'long'}]});
  // 加一个带 default 的可选字段：两个方向都能读，等于 FULL（Confluent 的 FULL 就是这么定义的）
  const v2 = JSON.stringify({type: 'record', name: 'U', fields: [
    {name: 'id', type: 'long'}, {name: 'nick', type: ['null', 'string'], 'default': null}]});
  const add = P.compatibility(v1, v2);
  assert.strictEqual(add.verdict, 'FULL', 'adding a defaulted field keeps both directions readable');
  assert.ok(add.backward && add.forward);
  assert.strictEqual(P.compatibility(v1, v1).verdict, 'FULL', 'identical schemas');

  // 加一个没有 default 的必填字段：新读端读不了旧数据，只能先升级生产者
  const v3 = JSON.stringify({type: 'record', name: 'U', fields: [
    {name: 'id', type: 'long'}, {name: 'nick', type: 'string'}]});
  const req = P.compatibility(v1, v3);
  assert.strictEqual(req.verdict, 'FORWARD', 'adding a required field is only forward compatible');
  assert.ok(!req.backward && req.forward);
  assert.strictEqual(P.compatibility(v3, v1).verdict, 'BACKWARD', 'dropping that field is the mirror case');

  const v4 = JSON.stringify({type: 'record', name: 'U', fields: [{name: 'id', type: 'string'}]});
  assert.strictEqual(P.compatibility(v1, v4).verdict, 'NONE', 'long to string is not allowed');

  const pw = JSON.stringify({type: 'record', name: 'U', fields: [{name: 'id', type: 'int'}]});
  assert.ok(P.compatibility(pw, v1).backward, 'int promotes to long');
});

// 7. 演进隐患提醒：字段缺 default、null 不在联合首位
t('advice for evolution hazards', function(){
  const r = P.analyze(JSON.stringify({
    type: 'record', name: 'U', namespace: 'n',
    fields: [{name: 'a', type: 'string'}, {name: 'b', type: ['string', 'null']}]
  }));
  assert.ok(has(r.issues, /default/), 'field without default hint');
  assert.ok(has(r.issues, /null/), 'null should come first hint');
});

// 8. 输入健壮性
t('input robustness', function(){
  assert.ok(P.analyze('').error, 'empty input');
  assert.ok(P.analyze('{oops').error, 'invalid json');
  const num = P.analyze('42');
  assert.ok(num.error || num.errCount > 0, 'a number is not a schema');
  const arr = P.analyze('["null","string"]');
  assert.ok(!arr.error, 'top level union parses');
  assert.strictEqual(arr.canonical, '["null","string"]');
  assert.ok(P.compatibility('{bad', '"string"').error, 'writer parse error surfaces');
  assert.ok(P.compatibility('"string"', '{bad').error, 'reader parse error surfaces');
});

console.log((fail ? 'FAILED' : 'PASS') + ' avro ' + pass + '/' + fail);
if (fail) process.exit(1);
