
const fs=require('fs');
const html=fs.readFileSync(__dirname+'/index.html','utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
if(!m){ console.error('no core script'); process.exit(1); }
const P=new Function(m[1]+'\n;return PromqlForgePure();')();
const assert=require('assert');
// 词法
var toks=P.tokenize('rate(http_requests_total[5m])');
assert.ok(toks.some(function(t){return t.type==='ident'&&t.value==='rate';}), 'token rate');
assert.ok(toks.some(function(t){return t.type==='ident'&&t.value==='http_requests_total';}), 'token metric');
assert.ok(toks.some(function(t){return t.value==='5m';}), 'token range 5m');
// 解释
var e=P.explain('sum(rate(http_requests_total{code="200"}[5m])) by (instance)');
assert.ok(!e.error, 'explain no error');
assert.strictEqual(e.metric,'http_requests_total','explain metric');
assert.strictEqual(e.range,'5m','explain range');
assert.ok(e.notes.some(function(n){return n.indexOf('聚合：sum by (instance)')===0;}),'explain agg');
assert.ok(e.notes.some(function(n){return n.indexOf('函数：rate()')===0;}),'explain fn rate');
// 构建
var b=P.build({fn:'rate', metric:'http_requests_total', range:'5m',
  filters:[{k:'code',op:'=',v:'200'}], agg:'sum', aggLabels:'instance'});
assert.strictEqual(b.query,'sum(rate(http_requests_total{code="200"}[5m])) by (instance)','build sum rate');
// 仅范围
var b2=P.build({metric:'up', range:'1m'});
assert.strictEqual(b2.query,'up[1m]','build range only');
// 仅聚合无 fn
var b3=P.build({metric:'node_cpu', agg:'avg', aggLabels:'cpu'});
assert.strictEqual(b3.query,'avg(node_cpu) by (cpu)','build avg');
console.log('PASS promql 8/0');
