
const fs=require('fs');
const html=fs.readFileSync(__dirname+'/index.html','utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
if(!m){ console.error('no core script'); process.exit(1); }
const P=new Function(m[1]+'\n;return CircuitForgePure();')();
const assert=require('assert');

const BASE='slidingWindowType = COUNT_BASED\nslidingWindowSize = 10\nminimumNumberOfCalls = 10\n'+
           'failureRateThreshold = 50\nslowCallRateThreshold = 100\nslowCallDurationThresholdMs = 1000\n'+
           'waitDurationInOpenStateMs = 1000\npermittedNumberOfCallsInHalfOpenState = 4\ncallIntervalMs = 100';

// ---- 配置解析 ----
var pc=P.parseConfig(BASE);
assert.strictEqual(pc.cfg.slidingWindowSize, 10);
assert.strictEqual(pc.cfg.failureRateThreshold, 50);
assert.strictEqual(pc.cfg.slidingWindowType, 'COUNT_BASED');
assert.strictEqual(P.parseConfig('# only a comment\n').cfg.slidingWindowSize, P.DEFAULTS.slidingWindowSize);
assert.ok(P.parseConfig('nopeKey = 1').unknown.indexOf('nopeKey') >= 0, 'unknown key reported');
assert.ok(P.parseConfig('slidingWindowSize = abc').bad.length === 1, 'non numeric flagged');

// ---- 事件解析 ----
var pe=P.parseEvents('F x3 S');
assert.strictEqual(pe.events.length, 4);
assert.strictEqual(pe.events[0].ok, false);
assert.strictEqual(pe.events[3].ok, true);
assert.strictEqual(P.parseEvents('S:1500 x2').events[1].durationMs, 1500);
assert.ok(P.parseEvents('').error, 'empty rejected');
assert.ok(P.parseEvents('Q').error, 'bad token rejected');
assert.ok(P.parseEvents('x5').error, 'leading repeat rejected');

// ---- 100% 失败：第 10 次调用触发熔断 ----
var r1=P.analyze(BASE, 'F x10');
assert.strictEqual(r1.summary.finalState, 'OPEN', 'all-fail trips');
assert.strictEqual(r1.transitions.length, 1);
assert.strictEqual(r1.transitions[0].from, 'CLOSED');
assert.strictEqual(r1.transitions[0].at, 900, 'trips on 10th call at t=900');

// ---- 恰好 50% 达到阈值即熔断（>= 语义）----
assert.strictEqual(P.analyze(BASE, 'S x5 F x5').summary.finalState, 'OPEN', '50% trips');
// ---- 40% 不熔断 ----
var r3=P.analyze(BASE, 'S x6 F x4');
assert.strictEqual(r3.summary.finalState, 'CLOSED', '40% stays closed');
assert.strictEqual(r3.transitions.length, 0);
// ---- 样本不足不评估 ----
assert.strictEqual(P.analyze(BASE, 'F x9').summary.finalState, 'CLOSED', 'below minimumNumberOfCalls');

// ---- OPEN 期间请求被拒绝 ----
var r4=P.analyze(BASE, 'F x10 S x5');
assert.strictEqual(r4.summary.rejected, 5, 'open rejects');
assert.strictEqual(r4.summary.permitted, 10, 'only first 10 permitted');
assert.strictEqual(r4.summary.finalState, 'OPEN');

// ---- 等待期结束后进入 HALF_OPEN，探活成功则关闭 ----
var r5=P.analyze(BASE, 'F x10 S x13');
var tos=r5.transitions.map(function(t){ return t.to; });
assert.deepStrictEqual(tos, ['OPEN','HALF_OPEN','CLOSED'], 'full recovery cycle');
assert.strictEqual(r5.summary.finalState, 'CLOSED');
assert.strictEqual(r5.transitions[1].at, 1900, 'half-open at t=1900');

// ---- 探活失败则再次熔断 ----
var r6=P.analyze(BASE, 'F x10 S x9 F x4');
var tos6=r6.transitions.map(function(t){ return t.to; });
assert.deepStrictEqual(tos6, ['OPEN','HALF_OPEN','OPEN'], 'probe failure reopens');

// ---- 慢调用熔断：全部成功但都超过慢阈值 ----
var SLOW=BASE.replace('slowCallRateThreshold = 100','slowCallRateThreshold = 50');
var r7=P.analyze(SLOW, 'S:1500 x10');
assert.strictEqual(r7.summary.finalState, 'OPEN', 'slow calls trip');
assert.ok(/慢调用率/.test(r7.transitions[0].reason), 'reason mentions slow rate');
assert.strictEqual(r7.summary.failures, 0, 'no hard failures');
assert.strictEqual(r7.summary.slowCalls, 10);
// 快调用不触发
assert.strictEqual(P.analyze(SLOW, 'S:100 x10').summary.finalState, 'CLOSED', 'fast calls fine');

// ---- 滑动窗口会遗忘旧失败 ----
var r8=P.analyze(BASE, 'F x4 S x10');
assert.strictEqual(r8.summary.finalState, 'CLOSED', 'window slides past old failures');

// ---- 配置体检 ----
var badLint=P.lintConfig(P.parseConfig('slidingWindowSize = 20\nminimumNumberOfCalls = 100').cfg);
assert.ok(badLint.some(function(x){ return x.level==='err' && /样本数永远凑不齐/.test(x.text); }), 'min>size flagged');
assert.ok(P.lintConfig(P.parseConfig('failureRateThreshold = 0').cfg).some(function(x){ return x.level==='err'; }), 'threshold 0 flagged');
assert.ok(P.lintConfig(P.parseConfig('permittedNumberOfCallsInHalfOpenState = 0').cfg).some(function(x){ return x.level==='err'; }), 'zero probe flagged');
assert.ok(P.lintConfig(P.parseConfig(BASE).cfg).some(function(x){ return x.level==='ok'; }), 'clean config passes');

// ---- 恢复规划 ----
var rec=P.recovery(P.parseConfig('permittedNumberOfCallsInHalfOpenState = 10\nfailureRateThreshold = 50\nwaitDurationInOpenStateMs = 5000\ncallIntervalMs = 100').cfg);
assert.strictEqual(rec.allowedFailuresInProbe, 4, '10 probes @50% tolerate 4 failures');
assert.strictEqual(rec.minSuccessesToClose, 6, 'need 6 successes');
assert.strictEqual(rec.fastestRecoveryMs, 6000, 'wait + probe time');

// ---- 预设表存在 ----
assert.strictEqual(P.PRESETS.resilience4j.minimumNumberOfCalls, 100);
assert.strictEqual(P.PRESETS.hystrix.slidingWindowType, 'TIME_BASED');

// ---- 错误处理 ----
assert.ok(P.analyze(BASE, '').error, 'empty events rejected');
assert.ok(P.analyze(BASE, 'F y3').error, 'bad repeat rejected');

console.log('PASS circuit 8/0');
