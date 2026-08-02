
const fs=require('fs');
const html=fs.readFileSync(__dirname+'/index.html','utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
if(!m){ console.error('no core script'); process.exit(1); }
const P=new Function(m[1]+'\n;return SloForgePure();')();
const assert=require('assert');
function near(a,b,eps,msg){ assert.ok(Math.abs(a-b) < (eps===undefined?1e-6:eps), (msg||'near')+': '+a+' vs '+b); }

// ---- 目标解析 ----
assert.strictEqual(P.parseObjective('99.9').value, 99.9);
assert.strictEqual(P.parseObjective('99.9%').value, 99.9);
near(P.parseObjective('3个9').value, 99.9, 1e-9, 'three nines');
near(P.parseObjective('4 个 9').value, 99.99, 1e-9, 'four nines');
assert.ok(P.parseObjective('100').error, '100% rejected');
assert.ok(P.parseObjective('0').error, '0% rejected');
assert.ok(P.parseObjective('abc').error, 'garbage rejected');

// ---- 错误预算：教科书数值 ----
var b=P.budget(99.9, 30);
near(b.allowedSeconds, 2592, 1e-9, '99.9% over 30d = 2592s');
assert.strictEqual(b.allowedText, '43 分 12 秒', 'human readable');
near(P.budget(99.99, 30).allowedSeconds, 259.2, 1e-9, '99.99% 30d');
near(P.budget(99, 30).allowedSeconds, 25920, 1e-9, '99% 30d');
near(P.budget(99.9, 7).allowedSeconds, 604.8, 1e-9, '99.9% 7d');
near(P.budget(99.9, 365).allowedSeconds, 31536, 1e-6, '99.9% 1y');
near(P.budget(99.999, 30).perYearSeconds, 315.36, 1e-6, 'five nines yearly');
assert.strictEqual(P.budget(99.9, 30).label, '三个九 99.9%');
assert.ok(P.budget(99.9, 0).error, 'zero window rejected');
assert.ok(P.budget(101, 30).error, 'bad objective rejected');

// ---- 时长格式化 ----
assert.strictEqual(P.fmtDuration(2592), '43 分 12 秒');
assert.strictEqual(P.fmtDuration(259.2), '4 分 19.2 秒');
assert.strictEqual(P.fmtDuration(0.25), '250 毫秒');
assert.strictEqual(P.fmtDuration(90061), '1 天 1 小时 1 分 1 秒');

// ---- 预算消耗 ----
var c=P.consume(10000000, 6000, 99.9, 30);
near(c.budgetRequests, 10000, 1e-6, 'budget requests');
near(c.usedPct, 60, 1e-6, '60% consumed');
near(c.errorRatePct, 0.06, 1e-9, 'error rate');
near(c.burnRate, 0.6, 1e-9, 'burn rate 0.6x');
assert.strictEqual(c.status, 'WATCH');
assert.strictEqual(c.meetsObjective, true);
var c2=P.consume(1000000, 5000, 99.9, 30);
assert.strictEqual(c2.status, 'EXHAUSTED', '5x over budget');
assert.strictEqual(c2.meetsObjective, false);
near(c2.burnRate, 5, 1e-9, 'burn 5x');
var c3=P.consume(1000000, 0, 99.9, 30);
assert.strictEqual(c3.status, 'HEALTHY');
near(c3.usedPct, 0, 1e-12);
assert.ok(P.consume(0, 1, 99.9, 30).error, 'zero total rejected');
assert.ok(P.consume(100, 200, 99.9, 30).error, 'bad>total rejected');
assert.ok(P.consume(100, -1, 99.9, 30).error, 'negative rejected');

// ---- 多窗口多燃尽率（SRE Workbook 经典数值）----
var mw=P.multiWindow(99.9, 30).rows;
assert.strictEqual(mw.length, 4);
near(mw[0].burnRate, 14.4, 1e-9, '1h page burn 14.4x');
near(mw[0].thresholdErrorRatePct, 1.44, 1e-9, '1h threshold 1.44%');
near(mw[1].burnRate, 6, 1e-9, '6h page burn 6x');
near(mw[2].burnRate, 3, 1e-9, '1d ticket burn 3x');
near(mw[3].burnRate, 1, 1e-9, '3d ticket burn 1x');
assert.strictEqual(mw[0].shortLabel, '5 分钟');
assert.strictEqual(mw[3].longLabel, '3 天');
// 更严目标 => 更低的绝对错误率阈值
assert.ok(P.multiWindow(99.99, 30).rows[0].thresholdErrorRatePct < mw[0].thresholdErrorRatePct);

// ---- 预算耗尽时间 ----
var tte=P.timeToExhaust(2, 30, 50);
near(tte.hours, 180, 1e-9, '50% left at 2x burn = 180h');
assert.strictEqual(P.timeToExhaust(1, 30, 100).hours, 720, 'full budget at 1x = window');
assert.ok(P.timeToExhaust(0, 30, 50).error, 'zero burn never exhausts');

// ---- 复合可用性 ----
var comp=P.composite([99.9, 99.9, 99.9]);
near(comp.serialPct, 99.7002999, 1e-6, 'serial chain of three');
near(P.composite([99.9, 99.99]).serialPct, 99.89001, 1e-6, 'serial two');
assert.ok(P.composite([]).error, 'empty rejected');
assert.ok(P.composite([99.9, 'x']).error, 'bad member rejected');
near(P.redundant(99, 2).availabilityPct, 99.99, 1e-9, 'two replicas of 99%');
near(P.redundant(99, 3).availabilityPct, 99.9999, 1e-9, 'three replicas');
assert.ok(P.redundant(99, 0).error, 'zero replicas rejected');

// ---- 由停机时长反推可用性 ----
near(P.availabilityFromDowntime(2592, 30).availabilityPct, 99.9, 1e-9, 'inverse of budget');
assert.ok(P.availabilityFromDowntime(9999999, 30).error, 'downtime beyond window rejected');

// ---- 汇总入口 ----
var r=P.analyze(99.9, 30, 10000000, 6000);
assert.strictEqual(r.alerts.length, 4);
assert.strictEqual(r.budget.windowDays, 30);
assert.ok(r.exhaust.hours > 0);
assert.ok(P.analyze(99.9, 30, 100, 200).error, 'analyze propagates errors');

console.log('PASS slo 8/0');
