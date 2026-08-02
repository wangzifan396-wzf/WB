
const fs=require('fs');
const html=fs.readFileSync(__dirname+'/index.html','utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
if(!m){ console.error('no core script'); process.exit(1); }
const P=new Function(m[1]+'\n;return CvssForgePure();')();
const assert=require('assert');

// ---- FIRST.org 官方 CVSS v3.1 示例向量 ----
assert.strictEqual(P.analyze('CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H').base, 9.8, 'v31 9.8');
assert.strictEqual(P.analyze('CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H').base, 7.5, 'v31 7.5');
assert.strictEqual(P.analyze('CVSS:3.1/AV:L/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H').base, 7.8, 'v31 7.8');
assert.strictEqual(P.analyze('CVSS:3.1/AV:N/AC:H/PR:N/UI:R/S:C/C:L/I:L/A:N').base, 4.7, 'v31 4.7 scope changed');
// CVE-2021-44228 Log4Shell = 10.0（Scope Changed 满分）
assert.strictEqual(P.analyze('CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H').base, 10.0, 'log4shell 10.0');
// 全 None => 0.0
assert.strictEqual(P.analyze('CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:N').base, 0, 'zero impact');

// ---- 时间分：E:U/RL:O/RC:C 会显著降分 ----
var t=P.analyze('CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H/E:U/RL:O/RC:C');
assert.strictEqual(t.base, 9.8, 'temporal keeps base');
assert.strictEqual(t.temporal, 8.5, 'temporal 8.5');

// ---- 环境分：CR/IR/AR 全 L 应低于基础分 ----
var e=P.analyze('CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H/CR:L/IR:L/AR:L');
assert.ok(e.environmental < e.base, 'env lower with low requirements');
// 修正指标覆盖：MAV:P（物理）应大幅降低环境分
var e2=P.analyze('CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H/MAV:P');
assert.ok(e2.environmental < 7, 'MAV:P lowers env, got '+e2.environmental);

// ---- Roundup 官方边界行为 ----
assert.strictEqual(P.roundup(4.02), 4.1, 'roundup 4.02');
assert.strictEqual(P.roundup(4.0), 4.0, 'roundup exact');
assert.strictEqual(P.roundup(0.1), 0.1, 'roundup 0.1');

// ---- 严重性分级 ----
assert.strictEqual(P.severity(0), '无 None');
assert.strictEqual(P.severity(3.9), '低 Low');
assert.strictEqual(P.severity(6.9), '中 Medium');
assert.strictEqual(P.severity(8.9), '高 High');
assert.strictEqual(P.severity(9.0), '严重 Critical');

// ---- CVSS v2.0 基础分 ----
assert.strictEqual(P.analyze('AV:N/AC:L/Au:N/C:C/I:C/A:C').base, 10.0, 'v2 10.0');
assert.strictEqual(P.analyze('AV:L/AC:H/Au:N/C:N/I:N/A:P').base, 1.2, 'v2 1.2');

// ---- v4.0 语法体检 ----
var v4=P.analyze('CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N');
assert.strictEqual(v4.version, '4.0');
assert.strictEqual(v4.issues.length, 0, 'v4 clean');
assert.strictEqual(v4.nomenclature, 'CVSS-B', 'v4 nomenclature B');
var v4t=P.analyze('CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N/E:A');
assert.strictEqual(v4t.nomenclature, 'CVSS-BT', 'v4 nomenclature BT');
var v4bad=P.analyze('CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H');
assert.ok(v4bad.issues.length >= 3, 'v4 missing SC/SI/SA flagged');

// ---- 错误处理 ----
assert.ok(P.analyze('').error, 'empty rejected');
assert.ok(P.analyze('CVSS:3.1/AV:X/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H').error, 'bad AV rejected');
assert.ok(P.analyze('CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H').error, 'missing A rejected');
assert.ok(P.analyze('CVSS:3.1/AVN/AC:L').error, 'malformed segment rejected');
assert.ok(P.analyze('CVSS:3.1/AV:N/AV:L/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H').error, 'duplicate metric rejected');

// ---- 向量规范化往返 ----
var norm=P.analyze('CVSS:3.1/C:H/A:H/I:H/S:U/UI:N/PR:N/AC:L/AV:N');
assert.strictEqual(norm.vector, 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H', 'canonical order');

console.log('PASS cvss 8/0');
