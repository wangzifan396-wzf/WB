
const fs=require('fs');
const html=fs.readFileSync(__dirname+'/index.html','utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
if(!m){ console.error('no core script'); process.exit(1); }
const P=new Function(m[1]+'\n;return BalancerForgePure();')();
const assert=require('assert');

// ---- FNV-1a 32 官方测试向量 ----
assert.strictEqual(P.fnv1a(''), 0x811c9dc5, 'fnv empty');
assert.strictEqual(P.fnv1a('a'), 0xe40c292c, 'fnv a');
assert.strictEqual(P.fnv1a('foobar'), 0xbf9cf968, 'fnv foobar');

// ---- 后端解析 ----
var pb=P.parseBackends('app-a=5\napp-b=1\napp-c  1  # comment');
assert.strictEqual(pb.backends.length, 3);
assert.strictEqual(pb.backends[0].weight, 5);
assert.strictEqual(pb.backends[2].weight, 1);
assert.strictEqual(P.parseBackends('solo').backends[0].weight, 1, 'default weight 1');
assert.ok(P.parseBackends('').error, 'empty rejected');
assert.ok(P.parseBackends('a\na').error, 'duplicate rejected');
assert.ok(P.parseBackends('a=0').error, 'zero weight rejected');

// ---- nginx 平滑加权轮询：{5,1,1} 的官方序列 a a b a c a a ----
var B=[{name:'a',weight:5},{name:'b',weight:1},{name:'c',weight:1}];
assert.deepStrictEqual(P.smoothWeightedRR(B, 7).seq, ['a','a','b','a','c','a','a'], 'nginx SWRR sequence');
// 一整轮后计数严格等于权重
var sw=P.smoothWeightedRR(B, 700).counts;
assert.strictEqual(sw.a, 500); assert.strictEqual(sw.b, 100); assert.strictEqual(sw.c, 100);
// SWRR 是周期性的：第二轮与第一轮完全一致
var seq14=P.smoothWeightedRR(B, 14).seq;
assert.deepStrictEqual(seq14.slice(0,7), seq14.slice(7), 'SWRR is periodic');

// ---- 轮询：忽略权重，均分 ----
var rr=P.roundRobin(B, 9).counts;
assert.strictEqual(rr.a, 3); assert.strictEqual(rr.b, 3); assert.strictEqual(rr.c, 3);

// ---- 最少连接：等权时分布均匀，加权时高权重承接更多 ----
var EQ=[{name:'a',weight:1},{name:'b',weight:1},{name:'c',weight:1},{name:'d',weight:1}];
var lc=P.leastConn(EQ, 400, 3);
var lcs=P.stats(lc.counts, EQ);
assert.strictEqual(lcs.total, 400);
assert.ok(lcs.imbalancePct < 5, 'least-conn even, got '+lcs.imbalancePct);
// 并发足够（在途 ≥ 权重之和 7）时，权重才表达得出来
var lcw=P.leastConn(B, 700, 12).counts;
assert.ok(lcw.a > lcw.b * 3, 'weighted least-conn favours heavy node, got '+JSON.stringify(lcw));
// 并发不足时最少连接表达不出权重，工具应当明说而不是假装分对了
var lowC=P.leastConn(B, 700, 5);
assert.ok(lowC.counts.a <= lowC.counts.b * 3.2, 'low concurrency degrades to near-even');
var we1=P.weightExpression(B, lowC.peakConcurrency);
assert.strictEqual(we1.sufficient, false, 'peak '+lowC.peakConcurrency+' < weightTotal 7');
assert.strictEqual(we1.weightTotal, 7);
assert.ok(/退化成接近等分/.test(we1.note));
var we2=P.weightExpression(B, 12);
assert.strictEqual(we2.sufficient, true);
assert.ok(/如实表达权重/.test(we2.note));
assert.ok(P.leastConn(EQ, 100, 3).peakConcurrency <= 3, 'peak bounded by service ticks');

// ---- P2C：确定性（同种子同结果），且比纯随机更均衡 ----
var p1=P.p2c(EQ, 500, 42, 3), p2=P.p2c(EQ, 500, 42, 3);
assert.deepStrictEqual(p1.counts, p2.counts, 'p2c deterministic with seed');
// 换种子会换出不同的选取顺序；但 P2C 的强项正是「顺序随机、总量仍然均分」，
// 所以这里比的是序列而不是计数
var p3=P.p2c(EQ, 500, 7, 3);
assert.notStrictEqual(p3.seq.join(''), p1.seq.join(''), 'different seed yields different order');
assert.deepStrictEqual(p3.counts, p1.counts, 'p2c converges to the same even split regardless of seed');
var ps=P.stats(p1.counts, EQ);
assert.strictEqual(ps.total, 500);
assert.ok(ps.imbalancePct < 15, 'p2c reasonably balanced, got '+ps.imbalancePct);

// ---- 一致性哈希：确定性 + 虚拟节点越多越均衡 ----
var keys=P.genKeys(2000);
var ch=P.consistentHash(EQ, keys, 200);
assert.strictEqual(P.stats(ch.counts, EQ).total, 2000);
assert.deepStrictEqual(P.consistentHash(EQ, keys, 200).counts, ch.counts, 'consistent hash deterministic');
var cvHigh=P.stats(P.consistentHash(EQ, keys, 400).counts, EQ).cv;
var cvLow=P.stats(P.consistentHash(EQ, keys, 1).counts, EQ).cv;
assert.ok(cvHigh < cvLow, 'more vnodes => lower CV ('+cvHigh.toFixed(3)+' vs '+cvLow.toFixed(3)+')');
// 环空间占比合计 100%
var share=P.ringShare(P.buildRing(EQ, 100)), sum=0;
for (var k in share) sum += share[k];
assert.ok(Math.abs(sum - 100) < 1e-6, 'ring share sums to 100, got '+sum);

// ---- 摘除节点：一致性哈希只迁移被摘节点的 key（核心不变量）----
var ej=P.ejectionReport(EQ, 4000, 200, 'd');
assert.strictEqual(ej.collateralMoves, 0, 'no collateral key movement');
assert.ok(ej.consistent.pct > 15 && ej.consistent.pct < 40, 'CH migrates ~1/4, got '+ej.consistent.pct.toFixed(1));
assert.ok(ej.modulo.pct > 60, 'modulo rehash storm, got '+ej.modulo.pct.toFixed(1));
assert.ok(ej.modulo.pct > ej.consistent.pct * 2, 'CH far better than modulo');
assert.ok(P.ejectionReport([{name:'only',weight:1}], 10, 100).error, 'single node rejected');
assert.ok(P.ejectionReport(EQ, 10, 100, 'ghost').error, 'unknown victim rejected');

// ---- 迁移率工具 ----
assert.strictEqual(P.migration({x:'a',y:'b'}, {x:'a',y:'c'}).pct, 50);
assert.strictEqual(P.migration({}, {}).pct, 0);

// ---- 统计量 ----
var stt=P.stats({a:10,b:10,c:10,d:10}, EQ);
assert.strictEqual(stt.stddev, 0);
assert.strictEqual(stt.imbalancePct, 0);
assert.ok(P.stats({a:40,b:0,c:0,d:0}, EQ).imbalancePct > 100, 'hot spot detected');

// ---- 汇总入口 ----
var r=P.analyze('app-a=5\napp-b=1\napp-c=1', 700, {vnodes:200});
assert.strictEqual(r.rows.length, 5);
assert.strictEqual(r.weightTotal, 7);
assert.strictEqual(r.swrrSeq.length, 32);
assert.ok(P.analyze('a', 0).error, 'zero requests rejected');
assert.ok(P.analyze('', 10).error, 'no backends rejected');

console.log('PASS balancer 8/0');
