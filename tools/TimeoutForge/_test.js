
const fs=require('fs');
const html=fs.readFileSync(__dirname+'/index.html','utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
if(!m){ console.error('no core script'); process.exit(1); }
const P=new Function(m[1]+'\n;return TimeoutForgePure();')();
const assert=require('assert');
function near(a,b,eps,msg){ assert.ok(Math.abs(a-b) < (eps===undefined?1e-6:eps), (msg||'near')+': '+a+' vs '+b); }

// ---- 解析 ----
var pc = P.parseChain('gateway 3000 900 1 0\nbff 2400 500 2 100');
assert.strictEqual(pc.ok, true);
assert.strictEqual(pc.value.length, 2);
assert.strictEqual(pc.value[0].name, 'gateway');
assert.strictEqual(pc.value[1].attempts, 2);
assert.strictEqual(pc.value[1].backoff, 100);
// 省略可选列
assert.strictEqual(P.parseChain('a 100').value[0].attempts, 1, '默认单次尝试');
assert.strictEqual(P.parseChain('a 100').value[0].p99, null, 'P99 可缺省');
// 注释与空行
assert.strictEqual(P.parseChain('# 注释\n\na 100\n  \nb 50').value.length, 2);
// 错误行
assert.ok(P.parseChain('').errors.length > 0, '空输入报错');
assert.ok(P.parseChain('onlyname').errors.length > 0, '缺列');
assert.ok(P.parseChain('a -5').errors.length > 0, '负超时');
assert.ok(P.parseChain('a 100 20 0').errors.length > 0, '尝试次数至少 1');
assert.ok(P.parseChain('a 100 20 1.5').errors.length > 0, '尝试次数须整数');

// ---- 最坏耗时 ----
assert.strictEqual(P.worstCase({timeout:500, attempts:1, backoff:0}), 500);
assert.strictEqual(P.worstCase({timeout:500, attempts:3, backoff:100}), 1700, '3×500 + 2×100');
assert.strictEqual(P.worstCase({timeout:200, attempts:2, backoff:0}), 400);

// ---- 放大系数 ----
var am = P.amplification([{name:'a',attempts:2},{name:'b',attempts:3},{name:'c',attempts:2}]);
assert.strictEqual(am.factor, 12);
assert.deepStrictEqual(am.value.map(function(x){ return x.cumulative; }), [2, 6, 12]);
assert.strictEqual(P.amplification([{name:'a',attempts:1}]).factor, 1);

// ---- 倒挂检测：下游超时不小于上游 ----
var bad = P.analyze('gateway 1000 300 1 0\nbff 1200 400 1 0');
assert.strictEqual(bad.ok, false);
assert.ok(bad.value.audit.issues.some(function(i){ return i.level === 'error' && /不小于上游/.test(i.msg); }));
assert.strictEqual(bad.grade, '存在倒挂');

// ---- 倒挂检测：重试撑爆上游窗口 ----
var burst = P.analyze('gateway 1000 300 1 0\nbff 400 100 3 100');
assert.ok(burst.value.audit.issues.some(function(i){ return i.level === 'error' && /最坏耗时/.test(i.msg); }),
  '3×400+2×100=1400 > 1000 应报错');

// ---- 超时低于自身 P99 ----
assert.ok(P.analyze('svc 100 300 1 0').value.audit.issues
  .some(function(i){ return i.level === 'error' && /低于自身 P99/.test(i.msg); }));
// 超时贴着 P99 只是告警
assert.ok(P.analyze('svc 320 300 1 0').value.audit.issues
  .some(function(i){ return i.level === 'warn' && /抖动/.test(i.msg); }));
// 超时过于宽松
assert.ok(P.analyze('svc 5000 300 1 0').value.audit.issues
  .some(function(i){ return i.level === 'warn' && /占死/.test(i.msg); }));
// 合理区间给 ok
assert.ok(P.analyze('svc 900 300 1 0').value.audit.issues
  .some(function(i){ return i.level === 'ok'; }));

// ---- 健康链路应当零错误 ----
var good = P.analyze('gateway 3000 900 1 0\nbff 1200 500 2 100\nuser-svc 500 220 2 50\nuser-db 300 60 1 0');
assert.strictEqual(good.value.audit.errors, 0, JSON.stringify(good.value.audit.issues.filter(function(i){return i.level==='error';})));
assert.strictEqual(good.value.amplification.factor, 4, '1×2×2×1');
assert.strictEqual(good.value.endToEndWorst, 3000);
assert.strictEqual(good.value.deepestWorst, 300);

// ---- 预算分配 ----
var al = P.allocate(1000, 3, 0.15);
assert.strictEqual(al.value.length, 3);
near(al.value[0].downstream, 850, 1e-9);
near(al.value[1].downstream, 722.5, 1e-9);
assert.ok(al.value[2].downstream < al.value[1].downstream, '逐层递减');
near(al.shrink, 1 - Math.pow(0.85, 3), 1e-9, '三层共缩水 1-0.85^3');
assert.ok(P.allocate(0, 3).error, '零预算');
assert.ok(P.allocate(1000, 0).error, '零层数');
assert.ok(P.allocate(1000, 3, 1).error, '自留比例必须小于 1');

// ---- 由分位数推荐超时 ----
var r1 = P.recommend(60, 220);            // 尾部比 3.7 -> 3 倍
assert.strictEqual(r1.factor, 3);
assert.strictEqual(r1.value, 660);
var r2 = P.recommend(50, 300);            // 尾部比 6 -> 2 倍
assert.strictEqual(r2.factor, 2);
assert.strictEqual(r2.value, 600);
var r3 = P.recommend(10, 200);            // 尾部比 20 -> 1.5 倍
assert.strictEqual(r3.factor, 1.5);
assert.ok(/长尾/.test(r3.note), '重尾要提示治理而不是放大超时');
// 带 P999 时取更大者
var r4 = P.recommend(60, 220, 900);
assert.strictEqual(r4.value, Math.ceil(900 * 1.2), 'P999×1.2 更大时以它为准');
assert.ok(/P999/.test(r4.basis));
assert.ok(P.recommend(100, 50).error, 'P99 小于 P50');
assert.ok(P.recommend(0, 100).error, '非正分位数');
assert.ok(P.recommend(60).error, '缺 P99');
assert.ok(P.recommend(60, 220, 100).error, 'P999 小于 P99');

// ---- 重试预算 ----
var rb = P.retryBudget(2000, 3, 0.1);
assert.strictEqual(rb.value.worstExtraRps, 4000, '2 次额外尝试 × 2000');
assert.strictEqual(rb.value.allowedExtraRps, 200);
assert.strictEqual(rb.value.exceeded, true);
near(rb.value.maxFailRate, 0.05, 1e-12, '10% 预算 / 2 次额外尝试');
assert.ok(/必须上重试预算/.test(rb.value.verdict));
// 单次尝试不产生额外流量
var rb1 = P.retryBudget(2000, 1);
assert.strictEqual(rb1.value.worstExtraRps, 0);
assert.strictEqual(rb1.value.exceeded, false);
assert.ok(P.retryBudget(0, 2).error);
assert.ok(P.retryBudget(100, 0).error);
assert.ok(P.retryBudget(100, 2, 1.5).error);

// ---- 对冲请求 ----
var hg = P.hedge(60, 220, 0.95);
near(hg.value.extraLoadPct, 5, 1e-9);
assert.strictEqual(hg.value.safe, true);
assert.ok(hg.value.triggerAtMs > 60 && hg.value.triggerAtMs < 220, '触发点落在 P50 与 P99 之间');
assert.ok(hg.value.tailAfter <= hg.value.tailBefore, '尾延迟不会变差');
// 触发过早不安全
var hg2 = P.hedge(60, 220, 0.8);
assert.strictEqual(hg2.value.safe, false);
assert.ok(/额外流量/.test(hg2.value.note));
assert.ok(hg2.value.triggerAtMs < hg.value.triggerAtMs, '越早触发点越靠前');
assert.ok(P.hedge(60, 220, 1).error, '分位数必须小于 1');
assert.ok(P.hedge(300, 100, 0.95).error, 'P99 小于 P50');

// ---- 汇总入口 ----
assert.ok(P.analyze('').error, '空链路');
assert.ok(P.analyze('bad line here 1 2 3 4 5').errors, '非法行冒泡');
assert.strictEqual(P.analyze('a 100').value.layers.length, 1, '单层也能分析');

console.log('PASS timeout 8/0');
