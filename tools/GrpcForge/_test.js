
const fs=require('fs');
const html=fs.readFileSync(__dirname+'/index.html','utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
if(!m){ console.error('no core script'); process.exit(1); }
const P=new Function(m[1]+'\n;return GrpcForgePure();')();
const assert=require('assert');

// ---- 状态码表完整性 ----
assert.strictEqual(P.STATUS.length, 17, 'gRPC 恰好 17 个状态码 0..16');
for (var i=0;i<17;i++) assert.strictEqual(P.STATUS[i].code, i, '码值连续');

// ---- 查表：数字 / 名称 / 大小写 / 连字符 ----
assert.strictEqual(P.statusOf(5).value.name, 'NOT_FOUND');
assert.strictEqual(P.statusOf('5').value.http, 404);
assert.strictEqual(P.statusOf('unavailable').value.code, 14);
assert.strictEqual(P.statusOf('deadline-exceeded').value.code, 4);
assert.strictEqual(P.statusOf(0).value.name, 'OK');
assert.ok(P.statusOf(17).error, '17 越界');
assert.ok(P.statusOf('').error, '空输入报错');
assert.ok(P.statusOf('NOT_A_CODE').error, '未知名报错');

// ---- 可重试集合就是官方那四个 ----
var rl = P.retryableList().slice().sort();
assert.deepStrictEqual(rl, ['ABORTED','DEADLINE_EXCEEDED','RESOURCE_EXHAUSTED','UNAVAILABLE']);
assert.strictEqual(P.statusOf('INVALID_ARGUMENT').value.retryable, false, '参数错重试无意义');

// ---- HTTP 反查 gRPC，官方映射表 ----
assert.strictEqual(P.fromHttp(404).value.code, 12, '404 映射到 UNIMPLEMENTED 而不是 NOT_FOUND');
assert.strictEqual(P.fromHttp(401).value.code, 16);
assert.strictEqual(P.fromHttp(403).value.code, 7);
assert.strictEqual(P.fromHttp(429).value.code, 14);
assert.strictEqual(P.fromHttp(504).value.code, 4);
assert.strictEqual(P.fromHttp(200).value.code, 0, '2xx 归 OK');
assert.strictEqual(P.fromHttp(418).value.code, 2, '无映射落 UNKNOWN');
assert.strictEqual(P.fromHttp(418).exact, false, '标注为非官方映射');
assert.ok(P.fromHttp(99).error, '非法 HTTP 码');

// ---- grpc-timeout 解析 ----
assert.strictEqual(P.parseTimeout('1S').value.ms, 1000);
assert.strictEqual(P.parseTimeout('100m').value.ms, 100);
assert.strictEqual(P.parseTimeout('1H').value.ms, 3600000);
assert.strictEqual(P.parseTimeout('500u').value.ns, 500000);
assert.ok(P.parseTimeout('100x').error, '未知单位');
assert.ok(P.parseTimeout('123456789S').error, '超过 8 位数字');
assert.ok(P.parseTimeout('1.5S').error, '不接受小数');

// ---- grpc-timeout 生成：取能整除的最粗单位 ----
assert.strictEqual(P.formatTimeout(2000).value, '2S');
assert.strictEqual(P.formatTimeout(1500).value, '1500m', '1.5 秒非整秒，退回毫秒');
assert.strictEqual(P.formatTimeout(3600000).value, '1H');
assert.strictEqual(P.formatTimeout(0.001).value, '1u');
assert.ok(P.formatTimeout(0).error, '零超时非法');
['2S','1500m','1H','500u'].forEach(function(s){
  assert.strictEqual(P.formatTimeout(P.parseTimeout(s).value.ms).value, s, 'roundtrip '+s);
});

// ---- 截止时间沿链传播 ----
var pr = P.propagate(1000, 3);
assert.strictEqual(pr.value.length, 3);
assert.ok(pr.value[0].outbound < 1000, '每跳都要缩水');
assert.ok(pr.value[2].outbound < pr.value[1].outbound, '单调递减');
assert.ok(pr.tail > 0, '末端仍有预算');
assert.ok(pr.shrink > 0.25 && pr.shrink < 0.3, '三跳各留 10% 共缩水约 27%, got '+pr.shrink);
assert.ok(P.propagate(1000, 0).error, '跳数须为正整数');

// ---- 十六进制与分帧 ----
assert.deepStrictEqual(P.hexBytes('00 0A ff').value, [0, 10, 255]);
assert.deepStrictEqual(P.hexBytes('0x00,0x0A').value, [0, 10], '容忍 0x 前缀与逗号');
assert.ok(P.hexBytes('abc').error, '奇数长度');
assert.ok(P.hexBytes('zz').error, '非十六进制');

var fr = P.parseFrames('00 00 00 00 05 68 65 6c 6c 6f');
assert.strictEqual(fr.value.length, 1);
assert.strictEqual(fr.value[0].length, 5);
assert.strictEqual(fr.value[0].compressed, false);
assert.strictEqual(String.fromCharCode.apply(null, fr.value[0].payload), 'hello');
var fr2 = P.parseFrames('0000000001 61 0000000001 62');
assert.strictEqual(fr2.value.length, 2, '连续两帧');
assert.strictEqual(fr2.value[1].offset, 6, '第二帧偏移正确');
assert.strictEqual(P.parseFrames('01 00 00 00 01 61').value[0].compressed, true);
var bad = P.parseFrames('00 00 00 00 05 68 65');
assert.ok(bad.error && bad.truncated, '声明 5 字节实际 2 字节要报截断');
assert.ok(P.parseFrames('02 00 00 00 00').error, '压缩标志只能 0 或 1');
assert.ok(P.parseFrames('00 00 00').error, '帧头不足 5 字节');

// ---- protobuf 线格式 ----
assert.strictEqual(P.readVarint([0x96, 0x01], 0).value, 150, 'varint 150 的经典编码');
assert.strictEqual(P.readVarint([0x96, 0x01], 0).size, 2);
assert.strictEqual(P.readVarint([0x08], 0).value, 8, '单字节 varint');
assert.ok(P.readVarint([0x96], 0).error, 'varint 被截断');

var sc = P.scanProto([0x08, 0x96, 0x01, 0x12, 0x02, 0x68, 0x69]);
assert.strictEqual(sc.value.length, 2);
assert.strictEqual(sc.value[0].field, 1);
assert.strictEqual(sc.value[0].wire, 0);
assert.strictEqual(sc.value[0].value, 150);
assert.strictEqual(sc.value[1].field, 2);
assert.strictEqual(sc.value[1].wireName, 'length-delimited');
assert.strictEqual(sc.value[1].asText, 'hi');
assert.ok(P.scanProto([0x12, 0x09, 0x61]).error, '声明长度超出实际数据');
assert.ok(P.scanProto([0x00, 0x01]).error, '字段号 0 非法');
assert.strictEqual(P.scanProto([]).value.length, 0, '空载荷无字段');

// ---- retryPolicy 体检 ----
var good = {maxAttempts:4, initialBackoffMs:100, maxBackoffMs:1000, backoffMultiplier:2, retryableStatusCodes:['UNAVAILABLE']};
function mix(o){ var r={}; for (var k in good) r[k]=good[k]; for (var j in o) r[j]=o[j]; return r; }
assert.strictEqual(P.checkRetryPolicy(good).ok, true);
assert.strictEqual(P.checkRetryPolicy(good).warnings.length, 0);
assert.strictEqual(P.checkRetryPolicy({}).ok, false, '空策略不合法');
assert.ok(P.checkRetryPolicy(mix({maxAttempts:1})).errors.length > 0, 'maxAttempts 至少 2');
assert.ok(P.checkRetryPolicy(mix({maxAttempts:9})).warnings.length > 0, '超过 5 会被截断');
assert.ok(P.checkRetryPolicy(mix({backoffMultiplier:1})).errors.length > 0, '乘数必须大于 1');
assert.ok(P.checkRetryPolicy(mix({maxBackoffMs:10})).errors.length > 0, 'maxBackoff 小于 initial 非法');
assert.ok(P.checkRetryPolicy(mix({retryableStatusCodes:[]})).errors.length > 0, '空重试码集合');
var w = P.checkRetryPolicy(mix({retryableStatusCodes:['INTERNAL']}));
assert.strictEqual(w.ok, true, '不可重试码只警告不拦截');
assert.ok(w.warnings.length > 0, 'INTERNAL 应给出警告');
assert.ok(P.checkRetryPolicy(mix({retryableStatusCodes:['NOPE']})).errors.length > 0, '非法码名报错');

// ---- 退避时间表 ----
var sch = P.retrySchedule(good);
assert.strictEqual(sch.value.length, 3, '4 次尝试之间有 3 次等待');
assert.deepStrictEqual(sch.value.map(function(r){ return r.backoffMs; }), [100, 200, 400]);
assert.strictEqual(sch.worstCaseMs, 700);
var cap = P.retrySchedule({maxAttempts:5, initialBackoffMs:400, maxBackoffMs:600, backoffMultiplier:3, retryableStatusCodes:['UNAVAILABLE']});
assert.deepStrictEqual(cap.value.map(function(r){ return r.backoffMs; }), [400, 600, 600, 600], '退避被 maxBackoff 封顶');
assert.strictEqual(P.retrySchedule(mix({maxAttempts:9})).attempts, 5, '上限截断到 5');
assert.ok(P.retrySchedule({}).error, '非法策略不出表');

// ---- 重试放大 ----
assert.strictEqual(P.amplification([3,3,3]).amplification, 27, '三层各三次等于 27 倍');
assert.ok(/危险/.test(P.amplification([3,3,3]).verdict));
assert.strictEqual(P.amplification([2,1,1]).amplification, 2);
assert.ok(/可接受/.test(P.amplification([2,1,1]).verdict));
assert.ok(P.amplification([]).error, '空输入');
assert.ok(P.amplification([0]).error, '尝试次数至少 1');

// ---- 汇总入口 ----
var A = P.analyze('UNAVAILABLE');
assert.strictEqual(A.value.status.code, 14);
assert.strictEqual(A.value.httpEquivalent, 503);
assert.strictEqual(A.value.retryable, true);
assert.strictEqual(A.value.timeoutSample, '1500m');
assert.ok(P.analyze('???').error);

console.log('PASS grpc 8/0');
