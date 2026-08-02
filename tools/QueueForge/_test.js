
const fs=require('fs');
const html=fs.readFileSync(__dirname+'/index.html','utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
if(!m){ console.error('no core script'); process.exit(1); }
const P=new Function(m[1]+'\n;return QueueForgePure();')();
const assert=require('assert');
function near(a,b,eps,msg){ assert.ok(Math.abs(a-b) < (eps===undefined?1e-6:eps), (msg||'near')+': '+a+' vs '+b); }

// ---- Little 定律 ----
var li=P.little({lambda:100, W:0.2});
near(li.L, 20, 1e-9, 'L = 100 * 0.2');
near(P.little({L:20, W:0.2}).lambda, 100, 1e-9, 'solve lambda');
near(P.little({L:20, lambda:100}).W, 0.2, 1e-9, 'solve W');
assert.ok(P.little({L:20}).error, 'needs two of three');

// ---- M/M/1 教科书数值：λ=8, μ=10 ----
var q=P.mm1(8, 10);
near(q.rho, 0.8, 1e-12, 'rho');
near(q.L, 4, 1e-12, 'L=4');
near(q.Lq, 3.2, 1e-12, 'Lq=3.2');
near(q.W, 0.5, 1e-12, 'W=0.5');
near(q.Wq, 0.4, 1e-12, 'Wq=0.4');
near(q.P0, 0.2, 1e-12, 'P0=0.2');
near(q.pn(0), 0.2, 1e-12, 'pn(0)');
near(q.pn(2), 0.128, 1e-12, 'pn(2)=0.8^2*0.2');
// Little 定律自洽
near(q.L, q.lambda * q.W, 1e-12, 'little holds');
// 等待时间分位数：P95 = ln(20)/(mu-lam)
near(q.waitPercentile(0.95), Math.log(20)/2, 1e-12, 'p95 wait');
assert.ok(P.mm1(10, 10).error, 'rho=1 unstable');
assert.ok(P.mm1(12, 10).error, 'rho>1 unstable');
assert.ok(P.mm1(0, 10).error, 'zero lambda rejected');

// ---- Erlang B 经典递推：a=2, c=3 -> 0.2105 ----
near(P.erlangB(2, 3), 0.21052631578, 1e-9, 'erlangB(2,3)');
near(P.erlangB(2, 0), 1, 1e-12, 'B with zero servers = 1');
near(P.erlangB(1, 1), 0.5, 1e-12, 'erlangB(1,1)');
near(P.erlangB(0, 5), 0, 1e-12, 'no load no loss');
// 服务台越多阻塞率越低
assert.ok(P.erlangB(5, 10) < P.erlangB(5, 5), 'more servers block less');

// ---- Erlang C：a=2, c=3 -> 4/9 ----
near(P.erlangC(2, 3), 4/9, 1e-12, 'erlangC(2,3)=4/9');
near(P.erlangC(1, 1), 1, 1e-12, 'single server always queues at rho');
assert.strictEqual(P.erlangC(5, 5), 1, 'a>=c saturated');
// Erlang C 恒大于等于 Erlang B
assert.ok(P.erlangC(2, 3) > P.erlangB(2, 3), 'C >= B');

// ---- M/M/c：λ=2, μ=1, c=3 ----
var r=P.mmc(2, 1, 3);
near(r.offeredLoad, 2, 1e-12, 'a=2');
near(r.rho, 2/3, 1e-12, 'rho=2/3');
near(r.waitProbability, 4/9, 1e-12, 'Pw=4/9');
near(r.Lq, 8/9, 1e-12, 'Lq=8/9');
near(r.Wq, 4/9, 1e-12, 'Wq=4/9');
near(r.W, 1+4/9, 1e-12, 'W=Wq+1/mu');
near(r.L, 2+8/9, 1e-12, 'L=Lq+a');
near(r.L, r.lambda * r.W, 1e-12, 'little holds for mmc');
// c=1 时 M/M/c 退化为 M/M/1
var d1=P.mmc(8, 10, 1), s1=P.mm1(8, 10);
near(d1.Wq, s1.Wq, 1e-12, 'mmc(c=1) == mm1');
near(d1.L, s1.L, 1e-12, 'mmc(c=1) L matches');
assert.ok(P.mmc(30, 10, 2).error, 'unstable rejected');
assert.ok(P.mmc(1, 1, 1.5).error, 'fractional servers rejected');
// 多服务台合并优于同算力单队列拆分（排队论经典结论）
assert.ok(P.mmc(18, 10, 2).Wq < P.mm1(9, 10).Wq, 'pooling beats splitting');

// ---- 分位数 ----
var pp=P.mmc(180, 25, 10);
assert.ok(pp.waitPercentile(0.99) > pp.waitPercentile(0.95), 'p99 > p95');
assert.ok(pp.waitPercentile(0.5) >= 0, 'p50 non negative');
assert.strictEqual(P.mmc(2, 1, 3).waitPercentile(0), 0, 'p0 = 0');

// ---- 容量规划 ----
var cap=P.capacityFor(180, 25, 0.02);
assert.ok(cap.c >= 8, 'need at least ceil(a)+1 servers, got '+cap.c);
assert.ok(cap.Wq <= 0.02, 'target met');
assert.ok(P.capacityFor(180, 25, 0.02).c <= P.capacityFor(180, 25, 0.001).c, 'stricter target needs more');
assert.ok(P.capacityFor(180, 25, 0).error, 'zero delay impossible');

// ---- 线程池容量（Little 定律实用版）----
var tp=P.threadPool(500, 200, 0.7);
near(tp.concurrency, 100, 1e-9, 'concurrency = 500 * 0.2');
assert.strictEqual(tp.threads, 143, 'ceil(100/0.7)');
assert.ok(tp.maxRpsAtPool > 500, 'headroom above current rps');
assert.ok(P.threadPool(500, 200, 1.5).error, 'util > 1 rejected');
assert.ok(P.threadPool(0, 200, 0.7).error, 'zero rps rejected');

// ---- 曲棍球棒曲线单调递增 ----
var cv=P.curve(25, 10, 9);
assert.strictEqual(cv.length, 9);
for (var i=1;i<cv.length;i++) assert.ok(cv[i].Wq > cv[i-1].Wq, 'Wq increases with rho');
assert.ok(cv[cv.length-1].Wq > cv[0].Wq * 10, 'hockey stick blow-up');

// ---- 拐点 ----
var kn=P.knee(25, 10, 1);
assert.ok(kn.rho > 0.5 && kn.rho < 1, 'knee inside range, got '+kn.rho);

// ---- 通用可扩展性定律 USL ----
near(P.usl(0, 0, 10).speedup, 10, 1e-12, 'linear scaling');
near(P.usl(0.03, 0, 100).speedup, 100/(1+0.03*99), 1e-12, 'amdahl contention');
var pk=P.uslPeak(0.03, 0.0001);
near(pk.peakN, Math.sqrt(0.97/0.0001), 1e-9, 'usl peak N');
assert.ok(P.usl(0.03, 0.0001, pk.peakN + 50).speedup < pk.peakSpeedup, 'beyond peak throughput drops');
assert.ok(P.uslPeak(0.03, 0).error, 'beta=0 has no peak');
assert.ok(P.usl(-1, 0, 10).error, 'negative alpha rejected');

// ---- 汇总入口 ----
var A=P.analyze(180, 25, 10);
assert.strictEqual(A.mmc.c, 10);
assert.strictEqual(A.curve.length, 9);
assert.ok(A.single, 'mm1 comparison present');
assert.ok(P.analyze(300, 25, 10).error, 'overload surfaces error');

console.log('PASS queue 8/0');
