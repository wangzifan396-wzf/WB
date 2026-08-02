
const fs=require('fs');
const html=fs.readFileSync(__dirname+'/index.html','utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
if(!m){ console.error('no core script'); process.exit(1); }
const P=new Function(m[1]+'\n;return LogqlForgePure();')();
const assert=require('assert');

// ---------- 流选择器 ----------
var s1=P.parseSelector('{app="api", env=~"prod|stage", tier!="db"}');
assert.ok(!s1.error,'selector ok');
assert.strictEqual(s1.matchers.length,3,'3 matchers');
assert.deepStrictEqual(s1.matchers[0],{label:'app',op:'=',value:'api',raw:'"api"'});
assert.strictEqual(s1.matchers[1].op,'=~','regex op');
assert.strictEqual(s1.matchers[2].op,'!=','neq op');
assert.ok(P.parseSelector('{}').error,'empty selector rejected');
assert.ok(P.parseSelector('{app=api}').error,'unquoted value rejected');
// 值里带逗号不能被切开
var s2=P.parseSelector('{app="a,b", x="y"}');
assert.strictEqual(s2.matchers.length,2,'comma inside quotes');
assert.strictEqual(s2.matchers[0].value,'a,b','comma preserved');

// ---------- 管道拆分 ----------
var st=P.splitStages(' |= "GET" != "healthz" | json | status>=400 | line_format "{{.msg}}" ');
assert.strictEqual(st.length,5,'5 stages');
assert.strictEqual(P.classifyStage(st[0]).kind,'line_contains');
assert.strictEqual(P.classifyStage(st[1]).kind,'line_not_contains');
assert.strictEqual(P.classifyStage(st[2]).parser,'json');
assert.strictEqual(P.classifyStage(st[3]).kind,'label_filter');
assert.strictEqual(P.classifyStage(st[4]).kind,'line_format');
// 引号里的竖线不能当成分隔符
var st2=P.splitStages('|~ "a|b" | logfmt');
assert.strictEqual(st2.length,2,'pipe inside string');
assert.strictEqual(P.classifyStage(st2[0]).arg,'a|b','regex arg intact');

// ---------- 日志查询 ----------
var lq=P.analyze('{app="api"} |= "GET" | json | status="500"');
assert.ok(!lq.error,'log query parsed');
assert.strictEqual(lq.ast.type,'log');
assert.strictEqual(lq.ast.stages.length,3);
assert.ok(lq.explain.length>=4,'explain lines');

// ---------- 指标查询 + 聚合 ----------
var mq=P.analyze('sum by (status) (rate({app="api"} |= "GET" | json [5m]))');
assert.ok(!mq.error,'metric query parsed');
assert.strictEqual(mq.ast.type,'metric');
assert.strictEqual(mq.ast.metric.fn,'rate');
assert.strictEqual(mq.ast.range,'5m');
assert.strictEqual(mq.ast.rangeSeconds,300,'5m = 300s');
assert.strictEqual(mq.ast.aggs.length,1,'one agg');
assert.strictEqual(mq.ast.aggs[0].fn,'sum');
assert.deepStrictEqual(mq.ast.aggs[0].labels,['status'],'by labels');
assert.strictEqual(mq.errCount,0,'clean metric query');

// topk 参数
var tk=P.analyze('topk(3, sum by (pod) (count_over_time({job="a"} |= "x" [1m])))');
assert.strictEqual(tk.ast.aggs.length,2,'nested aggs');
assert.strictEqual(tk.ast.aggs[0].param,3,'topk param');
assert.strictEqual(tk.errCount,0,'topk ok');

// offset
var of=P.analyze('rate({app="a"} |= "x" [5m] offset 1h)');
assert.strictEqual(of.ast.offset,'1h','offset parsed');
assert.strictEqual(P.dur2s('1h'),3600,'dur2s hour');
assert.strictEqual(P.dur2s('2d'),172800,'dur2s day');
assert.strictEqual(P.dur2s('bogus'),null,'bad duration');

// unwrap
var uw=P.analyze('quantile_over_time(0.99, {app="a"} |= "lat" | json | unwrap ms [10m])');
assert.strictEqual(uw.ast.hasUnwrap,true,'unwrap detected');
assert.strictEqual(uw.ast.metric.param,0.99,'quantile param');
assert.strictEqual(uw.errCount,0,'unwrap query clean');

// ---------- 体检规则 ----------
function has(r,re){ return r.issues.some(function(x){ return re.test(x.text); }); }
assert.ok(has(P.analyze('{request_id="abc"} |= "x"'),/高基数/),'high cardinality label');
assert.ok(has(P.analyze('{app="a"} | json | status="500"'),/最贵的一步/),'parse before filter');
assert.ok(has(P.analyze('{app="a"} | json | status="500" |= "GET"'),/提到/),'filter after parser');
assert.ok(has(P.analyze('{app="a"} |~ ".*timeout.*"'),/SIMD/),'trivial regex');
assert.ok(has(P.analyze('rate({app="a"} |= "x" [2d])'),/超过一天/),'huge range');
assert.ok(has(P.analyze('{app="a", app="b"} |= "x"'),/永远不会有结果/),'conflicting matchers');
assert.ok(has(P.analyze('{app=~"a.*"} |= "x"'),/等值匹配器/),'no equality matcher');
assert.ok(has(P.analyze('{app="a"} |= "x" | regexp "\\d+"'),/命名捕获组/),'regexp needs named group');
assert.ok(has(P.analyze('sum_over_time({app="a"} |= "x" [5m])'),/unwrap/),'unwrap required');
assert.ok(has(P.analyze('rate({app="a"} |= "x" | unwrap d [5m])'),/不能用于 rate/),'unwrap misuse');
assert.ok(has(P.analyze('topk(sum(rate({app="a"} |= "x" [5m])))'),/整数参数/),'topk needs param');
assert.ok(has(P.analyze('rate({app="a"} |= "x" [5m])'),/没有外层聚合/),'no outer agg hint');
assert.ok(has(P.analyze('{app="a"} |= ""'),/空过滤器/),'empty line filter');

// ---------- 规范化与重排 ----------
var f=P.analyze('sum by (status) (rate({app="api"} |= "GET" | json [5m]))');
assert.ok(/^sum by \(status\)\(/.test(f.formatted),'formatted head');
assert.ok(/\{app="api"\}/.test(f.formatted),'formatted selector');
var reordered=P.analyze('{app="a"} | json | status="500" |= "GET"');
assert.ok(reordered.optimized,'optimized suggestion produced');
assert.ok(reordered.optimized.indexOf('|= "GET"')<reordered.optimized.indexOf('| json'),'line filter hoisted');
assert.strictEqual(P.analyze('{app="a"} |= "GET" | json').optimized,null,'already optimal');

// ---------- 错误处理 ----------
assert.ok(P.analyze('').error,'empty rejected');
assert.ok(P.analyze('rate(5m)').error,'no selector rejected');
assert.ok(P.analyze('{app="a"').error,'unclosed brace rejected');
assert.ok(P.analyze('rate({app="a"} |= "x")').error,'metric without range rejected');
assert.ok(P.analyze('{app="a"} |= "x" [5m]').error,'range without metric rejected');
assert.ok(P.analyze('rate({app="a"} |= "x" [5q])').error,'bad duration rejected');
assert.ok(P.analyze('bogusfn({app="a"} |= "x" [5m])').error,'unknown fn rejected');

console.log('PASS logql 8/0');
