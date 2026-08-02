/* DateForge 内核单测：抽取 index.html 首个 <script> 在 Node 中执行 */
'use strict';
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { console.error('FAIL: 未找到内核 <script>'); process.exit(1); }

const mod = { exports: {} };
new Function('module', 'exports', 'require', m[1])(mod, mod.exports, require);
const DF = mod.exports;

let passed = 0, failed = 0;
function ok(cond, name) {
  if (cond) { passed++; }
  else { failed++; console.error('  FAIL: ' + name); }
}
function eq(a, b, name) {
  const ja = JSON.stringify(a), jb = JSON.stringify(b);
  ok(ja === jb, name + ' (got ' + ja + ', want ' + jb + ')');
}

/* ---- isLeap / dim / valid ---- */
eq(DF.isLeap(2024), true, 'isLeap 2024');
eq(DF.isLeap(2023), false, 'isLeap 2023');
eq(DF.isLeap(1900), false, 'isLeap 1900 (整百非闰)');
eq(DF.isLeap(2000), true, 'isLeap 2000 (400 倍数闰)');
eq(DF.dim(2024, 2), 29, 'dim 2024-02');
eq(DF.dim(2023, 2), 28, 'dim 2023-02');
eq(DF.dim(2026, 7), 31, 'dim 2026-07');
eq(DF.dim(2026, 4), 30, 'dim 2026-04');
eq(DF.valid(2026, 2, 29), false, 'valid 平年 2/29 非法');
eq(DF.valid(2024, 2, 29), true, 'valid 闰年 2/29 合法');
eq(DF.valid(2026, 13, 1), false, 'valid 月>12 非法');
eq(DF.valid(2026, 0, 1), false, 'valid 月=0 非法');

/* ---- serial 往返 ---- */
eq(DF.toSerial(1970, 1, 1), 0, 'toSerial epoch=0');
eq(DF.toSerial(1970, 1, 2), 1, 'toSerial epoch+1');
eq(DF.toSerial(1969, 12, 31), -1, 'toSerial epoch-1');
eq(DF.fromSerial(0), { y: 1970, m: 1, d: 1 }, 'fromSerial 0');
eq(DF.fromSerial(DF.toSerial(2026, 7, 27)), { y: 2026, m: 7, d: 27 }, 'serial 往返 2026-07-27');
eq(DF.fromSerial(DF.toSerial(1600, 2, 29)), { y: 1600, m: 2, d: 29 }, 'serial 往返 1600-02-29');
/* 随机往返 */
(function () {
  let allOk = true;
  for (let i = 0; i < 500; i++) {
    const n = Math.floor(Math.random() * 800000) - 400000;
    if (DF.toSerial.apply(null, [DF.fromSerial(n).y, DF.fromSerial(n).m, DF.fromSerial(n).d]) !== n) allOk = false;
  }
  ok(allOk, 'serial 随机往返 500 次');
})();

/* ---- parse / fmt ---- */
eq(DF.parse('2026-07-27'), { y: 2026, m: 7, d: 27 }, 'parse ISO');
eq(DF.parse('2026/7/4'), { y: 2026, m: 7, d: 4 }, 'parse 斜杠单位数');
eq(DF.parse('2026年7月27日'), { y: 2026, m: 7, d: 27 }, 'parse 中文');
eq(DF.parse('2026-02-30'), null, 'parse 非法日返回 null');
eq(DF.parse('abc'), null, 'parse 乱串返回 null');
eq(DF.parse(123), null, 'parse 非字符串返回 null');
eq(DF.fmt({ y: 2026, m: 7, d: 4 }), '2026-07-04', 'fmt 补零');
eq(DF.fmt({ y: 2026, m: 7, d: 4 }, '/'), '2026/07/04', 'fmt 自定义分隔');

/* ---- weekday ---- */
eq(DF.weekday({ y: 1970, m: 1, d: 1 }), 3, 'weekday 1970-01-01 周四');
eq(DF.weekday({ y: 2026, m: 7, d: 27 }), 0, 'weekday 2026-07-27 周一');
eq(DF.weekday({ y: 2026, m: 7, d: 26 }), 6, 'weekday 2026-07-26 周日');
eq(DF.weekdayName(0), '周一', 'weekdayName 0');
eq(DF.weekdayName(6), '周日', 'weekdayName 6');

/* ---- diffDays / diffYMD ---- */
eq(DF.diffDays({ y: 2026, m: 1, d: 1 }, { y: 2026, m: 12, d: 31 }), 364, 'diffDays 2026 全年');
eq(DF.diffDays({ y: 2024, m: 1, d: 1 }, { y: 2024, m: 12, d: 31 }), 365, 'diffDays 闰年全年');
eq(DF.diffDays({ y: 2026, m: 7, d: 27 }, { y: 2026, m: 7, d: 20 }), -7, 'diffDays 负数');
(function () {
  const r = DF.diffYMD({ y: 2020, m: 1, d: 31 }, { y: 2026, m: 3, d: 1 });
  ok(r.years === 6 && r.months === 1 && r.days === 1 && r.sign === 1, 'diffYMD 2020-01-31→2026-03-01 = 6y1m1d');
})();
(function () {
  const r = DF.diffYMD({ y: 2026, m: 3, d: 1 }, { y: 2020, m: 1, d: 31 });
  ok(r.sign === -1 && r.years === 6, 'diffYMD 反向符号');
})();
(function () {
  const r = DF.diffYMD({ y: 2026, m: 7, d: 27 }, { y: 2026, m: 7, d: 27 });
  ok(r.years === 0 && r.months === 0 && r.days === 0 && r.totalDays === 0, 'diffYMD 同日全零');
})();

/* ---- addDays / addMonths / addYears ---- */
eq(DF.addDays({ y: 2026, m: 12, d: 31 }, 1), { y: 2027, m: 1, d: 1 }, 'addDays 跨年');
eq(DF.addDays({ y: 2026, m: 1, d: 1 }, -1), { y: 2025, m: 12, d: 31 }, 'addDays 负数跨年');
eq(DF.addDays({ y: 2024, m: 2, d: 28 }, 1), { y: 2024, m: 2, d: 29 }, 'addDays 闰年 2/29');
eq(DF.addMonths({ y: 2026, m: 1, d: 31 }, 1), { y: 2026, m: 2, d: 28 }, 'addMonths 1/31+1m 收敛 2/28');
eq(DF.addMonths({ y: 2024, m: 1, d: 31 }, 1), { y: 2024, m: 2, d: 29 }, 'addMonths 闰年收敛 2/29');
eq(DF.addMonths({ y: 2026, m: 11, d: 15 }, 3), { y: 2027, m: 2, d: 15 }, 'addMonths 跨年');
eq(DF.addMonths({ y: 2026, m: 3, d: 15 }, -15), { y: 2024, m: 12, d: 15 }, 'addMonths 负数跨多年');
eq(DF.addYears({ y: 2024, m: 2, d: 29 }, 1), { y: 2025, m: 2, d: 28 }, 'addYears 闰日收敛');
eq(DF.addYears({ y: 2024, m: 2, d: 29 }, 4), { y: 2028, m: 2, d: 29 }, 'addYears 闰→闰保留');

/* ---- isoWeek / dayOfYear ---- */
eq(DF.isoWeek({ y: 2026, m: 1, d: 1 }), { year: 2026, week: 1 }, 'isoWeek 2026-01-01 W1');
eq(DF.isoWeek({ y: 2027, m: 1, d: 1 }), { year: 2026, week: 53 }, 'isoWeek 2027-01-01 属 2026-W53');
eq(DF.isoWeek({ y: 2024, m: 12, d: 30 }), { year: 2025, week: 1 }, 'isoWeek 2024-12-30 属 2025-W1');
eq(DF.isoWeek({ y: 2026, m: 7, d: 27 }), { year: 2026, week: 31 }, 'isoWeek 2026-07-27 W31');
eq(DF.dayOfYear({ y: 2026, m: 1, d: 1 }), 1, 'dayOfYear 1/1');
eq(DF.dayOfYear({ y: 2026, m: 12, d: 31 }), 365, 'dayOfYear 平年末');
eq(DF.dayOfYear({ y: 2024, m: 12, d: 31 }), 366, 'dayOfYear 闰年末');

/* ---- workdays ---- */
/* 2026-07-27(一) ~ 2026-07-31(五) = 5 个工作日 */
eq(DF.workdays({ y: 2026, m: 7, d: 27 }, { y: 2026, m: 7, d: 31 }), 5, 'workdays 整周一~五');
/* 2026-07-25(六) ~ 2026-07-26(日) = 0 */
eq(DF.workdays({ y: 2026, m: 7, d: 25 }, { y: 2026, m: 7, d: 26 }), 0, 'workdays 纯周末');
/* 2026-07-20(一) ~ 2026-08-02(日) = 10 */
eq(DF.workdays({ y: 2026, m: 7, d: 20 }, { y: 2026, m: 8, d: 2 }), 10, 'workdays 两整周');
eq(DF.workdays({ y: 2026, m: 7, d: 27 }, { y: 2026, m: 7, d: 27 }), 1, 'workdays 同日周一=1');
eq(DF.workdays({ y: 2026, m: 7, d: 26 }, { y: 2026, m: 7, d: 26 }), 0, 'workdays 同日周日=0');
eq(DF.workdays({ y: 2026, m: 7, d: 31 }, { y: 2026, m: 7, d: 27 }), -5, 'workdays 反向为负');

/* ---- age ---- */
(function () {
  const a = DF.age({ y: 2000, m: 2, d: 29 }, { y: 2026, m: 7, d: 27 });
  ok(a.years === 26, 'age 闰日出生 26 岁');
  eq(a.nextBirthday, { y: 2027, m: 2, d: 28 }, 'age 闰日下次生日收敛 2/28');
})();
(function () {
  const a = DF.age({ y: 2000, m: 7, d: 27 }, { y: 2026, m: 7, d: 27 });
  ok(a.years === 26 && a.months === 0 && a.days === 0, 'age 生日当天整 26 岁');
  eq(a.nextBirthday, { y: 2027, m: 7, d: 27 }, 'age 生日当天下次为明年');
})();
(function () {
  const a = DF.age({ y: 2000, m: 8, d: 1 }, { y: 2026, m: 7, d: 27 });
  ok(a.years === 25 && a.nextBirthdayDays === 5, 'age 生日前 5 天');
})();

/* ---- unix ---- */
eq(DF.toUnix({ y: 1970, m: 1, d: 1 }), 0, 'toUnix epoch');
eq(DF.toUnix({ y: 2026, m: 1, d: 1 }), 1767225600, 'toUnix 2026-01-01');
eq(DF.fromUnix(1767225600), { y: 2026, m: 1, d: 1 }, 'fromUnix 2026-01-01');
eq(DF.fromUnix(0), { y: 1970, m: 1, d: 1 }, 'fromUnix 0');
eq(DF.fromUnix(-86400), { y: 1969, m: 12, d: 31 }, 'fromUnix 负数');

/* ---- today ---- */
(function () {
  const t = DF.today();
  ok(DF.valid(t.y, t.m, t.d), 'today 返回合法日期');
})();

console.log('DateForge tests: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed ? 1 : 0);
