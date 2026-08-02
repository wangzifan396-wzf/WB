
const fs = require('fs');
const assert = require('assert');
const html = fs.readFileSync(__dirname + '/index.html', 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
const P = new Function(m[1] + '\n;return OtelForgePure();')();

let pass = 0, fail = 0;
function t(name, fn){ try { fn(); pass++; } catch (e){ fail++; console.log('FAIL ' + name + ': ' + e.message); } }
function has(r, re){ return r.issues.some(function(x){ return re.test(x.text); }); }

const T0 = 1735689600000000000;
const TID = '4bf92f3577b34da6a3ce929d0e0e4736';
function sv(k, v){ return {key: k, value: {stringValue: v}}; }
function iv(k, v){ return {key: k, value: {intValue: String(v)}}; }
function span(o){
  return {
    traceId: o.t || TID, spanId: o.s, parentSpanId: o.p || '',
    name: o.n, kind: o.k == null ? 1 : o.k,
    startTimeUnixNano: String(T0 + o.a), endTimeUnixNano: String(T0 + o.b),
    status: o.st || {}, attributes: o.attrs || [], events: o.ev || []
  };
}
function doc(resAttrs, spans, scope){
  return JSON.stringify({resourceSpans: [{
    resource: {attributes: resAttrs},
    scopeSpans: [{scope: {name: scope || 'test', version: '1.0'}, spans: spans}]
  }]});
}
const OK_RES = [sv('service.name', 'api'), sv('service.version', '1.0.0'),
                sv('deployment.environment.name', 'prod'), sv('telemetry.sdk.name', 'opentelemetry'),
                sv('telemetry.sdk.language', 'go')];

// 1. OTLP/JSON 解析与 AnyValue 拆包
t('parses OTLP json and unwraps AnyValue', function(){
  const r = P.analyze(doc(OK_RES, [span({s: '00f067aa0ba902b7', n: 'GET /x', k: 2, a: 0, b: 5000000,
    attrs: [sv('http.request.method', 'GET'), sv('http.route', '/x'), iv('http.response.status_code', 200)]})]));
  assert.ok(!r.error, r.error);
  assert.strictEqual(r.summary.spanCount, 1);
  assert.strictEqual(r.summary.serviceCount, 1);
  assert.strictEqual(r.summary.services[0].name, 'api');
  assert.strictEqual(r.traces[0].critical.steps[0].kind, 'SERVER');
  assert.strictEqual(r.traces[0].durationText, '5.00 ms');

  const p = P.parse(doc(OK_RES, [span({s: '00f067aa0ba902b7', n: 'x', a: 0, b: 1,
    attrs: [{key: 'b', value: {boolValue: true}}, {key: 'd', value: {doubleValue: 1.5}},
            {key: 'a', value: {arrayValue: {values: [{stringValue: 'p'}, {stringValue: 'q'}]}}}]})]));
  assert.strictEqual(p.spans[0].attrs.b, true);
  assert.strictEqual(p.spans[0].attrs.d, 1.5);
  assert.deepStrictEqual(p.spans[0].attrs.a, ['p', 'q']);
});

// 2. 链路树重建：父子、深度、孤儿、多根
t('rebuilds the span tree', function(){
  const r = P.analyze(doc(OK_RES, [
    span({s: 'aaaaaaaaaaaaaaa1', n: 'root', k: 2, a: 0, b: 100000000}),
    span({s: 'aaaaaaaaaaaaaaa2', p: 'aaaaaaaaaaaaaaa1', n: 'child', k: 3, a: 10000000, b: 80000000}),
    span({s: 'aaaaaaaaaaaaaaa3', p: 'aaaaaaaaaaaaaaa2', n: 'grand', k: 3, a: 20000000, b: 70000000}),
    span({s: 'aaaaaaaaaaaaaaa4', p: 'bbbbbbbbbbbbbbbb', n: 'orphan', a: 5000000, b: 6000000})
  ]));
  const tr = r.traces[0];
  assert.strictEqual(tr.spans, 4);
  assert.strictEqual(tr.roots, 1);
  assert.strictEqual(tr.orphans, 1);
  assert.strictEqual(tr.depth, 3);
  assert.ok(has(r, /孤儿/), 'orphan is reported');
});

// 3. 关键路径：逐层挑最长的子 span
t('critical path picks the slowest chain', function(){
  const r = P.analyze(doc(OK_RES, [
    span({s: 'cccccccccccccc01', n: 'root', k: 2, a: 0, b: 100000000}),
    span({s: 'cccccccccccccc02', p: 'cccccccccccccc01', n: 'fast', k: 3, a: 1000000, b: 4000000}),
    span({s: 'cccccccccccccc03', p: 'cccccccccccccc01', n: 'slow', k: 3, a: 5000000, b: 95000000}),
    span({s: 'cccccccccccccc04', p: 'cccccccccccccc03', n: 'deep', k: 3, a: 6000000, b: 90000000})
  ]));
  const names = r.traces[0].critical.steps.map(function(x){ return x.name; });
  assert.deepStrictEqual(names, ['root', 'slow', 'deep']);
  assert.strictEqual(r.traces[0].critical.total, 100000000);
  assert.ok(r.traces[0].critical.steps[1].pct > 80, 'slow dominates the root span');
});

// 4. ID 与时序校验
t('flags bad ids and impossible timing', function(){
  const r = P.analyze(doc(OK_RES, [
    span({t: 'nothex', s: 'short', n: 'bad', a: 0, b: 1000}),
    span({s: 'dddddddddddddd01', n: 'reversed', a: 90000000, b: 10000000}),
    span({s: 'dddddddddddddd02', p: 'dddddddddddddd02', n: 'selfparent', a: 0, b: 1000})
  ]));
  assert.ok(has(r, /traceId 不是 32 位/), 'bad trace id');
  assert.ok(has(r, /spanId 不是 16 位/), 'bad span id');
  assert.ok(has(r, /结束时间早于开始时间/), 'negative duration');
  assert.ok(has(r, /指向自己/), 'self parent');
  assert.ok(r.errCount >= 4);

  const dup = P.analyze(doc(OK_RES, [
    span({s: 'eeeeeeeeeeeeee01', n: 'a', a: 0, b: 1000}),
    span({s: 'eeeeeeeeeeeeee01', n: 'b', a: 0, b: 1000})
  ]));
  assert.ok(has(dup, /出现了多次/), 'duplicate span id');
});

// 5. 语义约定：旧键改名、缺 service.name、高基数 span 名
t('semantic convention checks', function(){
  const r = P.analyze(doc([sv('deployment.environment', 'prod')], [
    span({s: 'ffffffffffffff01', n: 'GET /users/98213/profile', k: 2, a: 0, b: 1000000,
          attrs: [sv('http.method', 'GET'), sv('http.url', 'https://api/u'), iv('http.status_code', 200)]})
  ]));
  assert.ok(has(r, /service\.name/), 'missing service.name is an error');
  assert.ok(has(r, /http\.request\.method/), 'http.method renamed');
  assert.ok(has(r, /url\.full/), 'http.url renamed');
  assert.ok(has(r, /deployment\.environment\.name/), 'resource key renamed');
  assert.ok(has(r, /高基数/), 'id inside span name');
});

// 6. 状态与异常事件的一致性
t('status and exception consistency', function(){
  const r = P.analyze(doc(OK_RES, [
    span({s: '1111111111111101', n: 'GET /a', k: 2, a: 0, b: 1000000,
          attrs: [sv('http.request.method', 'GET'), sv('http.route', '/a'), iv('http.response.status_code', 503)]}),
    span({s: '1111111111111102', n: 'work', a: 0, b: 1000000,
          ev: [{name: 'exception', timeUnixNano: String(T0 + 500000), attributes: [sv('exception.message', 'boom')]}]})
  ]));
  assert.ok(has(r, /503.*ERROR|没有把 span 状态置为 ERROR/), '5xx without error status');
  assert.ok(has(r, /exception\.type/), 'exception event missing type');
  assert.ok(has(r, /记录了 exception 事件却没有把状态置为 ERROR/), 'exception without error status');

  const ok4xx = P.analyze(doc(OK_RES, [
    span({s: '1111111111111103', n: 'GET /b', k: 2, a: 0, b: 1000, st: {code: 2},
          attrs: [sv('http.request.method', 'GET'), sv('http.route', '/b'), iv('http.response.status_code', 404)]})
  ]));
  assert.ok(has(ok4xx, /4xx/), 'server side 4xx should not be ERROR');
});

// 7. 敏感信息与体积成本
t('secret detection and payload estimate', function(){
  const r = P.analyze(doc(OK_RES, [
    span({s: '2222222222222201', n: 'call', k: 3, a: 0, b: 1000000,
          attrs: [sv('http.request.header.authorization', 'Bearer eyJhbGciOiJIUzI1NiJ9.xyz'),
                  sv('db.system.name', 'mysql'),
                  sv('db.query.text', "SELECT * FROM t WHERE name = 'bob'")]})
  ]));
  assert.ok(has(r, /凭据/), 'secret key name');
  assert.ok(has(r, /字面量参数/), 'sql literal');
  assert.ok(r.errCount > 0);
  assert.ok(r.payload.bytes > 0 && r.payload.perSpan > 0);
  assert.strictEqual(r.payload.spans, 1);
  assert.ok(r.payload.dailyGB1k > 0, 'daily volume projection');
});

// 8. 输入健壮性
t('input robustness', function(){
  assert.ok(P.analyze('').error, 'empty');
  assert.ok(P.analyze('{oops').error, 'invalid json');
  assert.ok(P.analyze('{"foo":1}').error, 'no resourceSpans');
  assert.ok(P.analyze('{"resourceSpans":[]}').error, 'empty resourceSpans');
  assert.ok(P.analyze('{"resourceSpans":[{"resource":{},"scopeSpans":[]}]}').error, 'no spans at all');
  // 裸的 resourceSpans 数组也应当被接受
  const full = JSON.parse(doc(OK_RES, [span({s: '3333333333333301', n: 'x', a: 0, b: 1000})]));
  const bare = P.analyze(JSON.stringify(full.resourceSpans));
  assert.ok(!bare.error, 'bare resourceSpans array: ' + bare.error);
  assert.strictEqual(bare.summary.spanCount, 1);
  // 单个 resourceSpans 条目直接丢进来也能识别
  const one = P.analyze(JSON.stringify(full.resourceSpans[0]));
  assert.ok(!one.error, 'single resourceSpans entry: ' + one.error);
  assert.strictEqual(one.summary.spanCount, 1);
});

console.log((fail ? 'FAILED' : 'PASS') + ' otel ' + pass + '/' + fail);
if (fail) process.exit(1);
