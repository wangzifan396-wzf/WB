/* HabitForge 内核单测 */
'use strict';
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { console.error('FAIL: 未找到内核 <script>'); process.exit(1); }
const mod = { exports: {} };
new Function('module', 'exports', 'require', m[1])(mod, mod.exports, require);
const HF = mod.exports;

let passed = 0, failed = 0;
function ok(cond, name) { if (cond) passed++; else { failed++; console.error('  FAIL: ' + name); } }
function eq(a, b, name) { const ja = JSON.stringify(a), jb = JSON.stringify(b); ok(ja === jb, name + ' (got ' + ja + ', want ' + jb + ')'); }

/* ---- 日期底座 ---- */
eq(HF.serialOfKey('1970-01-01'), 0, 'serialOfKey epoch');
eq(HF.keyOfSerial(0), '1970-01-01', 'keyOfSerial epoch');
eq(HF.serialOfKey('2026-02-30'), null, 'serialOfKey 非法日 null');
eq(HF.serialOfKey('2024-02-29'), HF.toSerial(2024, 2, 29), 'serialOfKey 闰日合法');
eq(HF.parseKey('2026-7-27'), null, 'parseKey 必须补零格式');
eq(HF.keyOfSerial(HF.serialOfKey('2026-07-27') + 1), '2026-07-28', 'key 加一天');

/* ---- 数据模型 ---- */
const st = HF.makeState();
eq(st.habits.length, 0, 'makeState 空');
const h1 = HF.addHabit(st, '早起');
const h2 = HF.addHabit(st, '  阅读 30 分钟  ');
ok(h1.id === 1 && h2.id === 2, 'addHabit 自增 id');
eq(h2.name, '阅读 30 分钟', 'addHabit trim 名称');
eq(HF.addHabit(st, '   '), null, 'addHabit 空名拒绝');
eq(st.habits.length, 2, '两个习惯');
ok(HF.findHabit(st, 2) === h2, 'findHabit 命中');
eq(HF.findHabit(st, 99), null, 'findHabit 未命中 null');

/* ---- toggle / isDone ---- */
eq(HF.toggle(st, 1, '2026-07-27'), true, 'toggle 打卡 true');
eq(HF.isDone(h1, '2026-07-27'), true, 'isDone true');
eq(HF.toggle(st, 1, '2026-07-27'), false, 'toggle 再点取消 false');
eq(HF.isDone(h1, '2026-07-27'), false, 'isDone false');
eq(HF.toggle(st, 1, '2026-02-30'), null, 'toggle 非法日期 null');
eq(HF.toggle(st, 99, '2026-07-27'), null, 'toggle 不存在习惯 null');

/* ---- streak ---- */
/* h1: 7/25,7/26,7/27 连续 3 天 */
HF.toggle(st, 1, '2026-07-25');
HF.toggle(st, 1, '2026-07-26');
HF.toggle(st, 1, '2026-07-27');
eq(HF.currentStreak(h1, '2026-07-27'), 3, 'currentStreak 3 天');
/* 今天(7/28)还没打卡 → 从昨天起算不清零 */
eq(HF.currentStreak(h1, '2026-07-28'), 3, 'currentStreak 今天未打卡从昨天算');
/* 断一天后清零 */
eq(HF.currentStreak(h1, '2026-07-30'), 0, 'currentStreak 断档清零');
eq(HF.longestStreak(h1), 3, 'longestStreak 3');
/* 加一段更长的：7/1~7/5 共 5 天 */
['2026-07-01','2026-07-02','2026-07-03','2026-07-04','2026-07-05'].forEach(k => HF.toggle(st, 1, k));
eq(HF.longestStreak(h1), 5, 'longestStreak 更新为 5');
eq(HF.currentStreak(h1, '2026-07-27'), 3, 'currentStreak 不受历史段影响');
eq(HF.longestStreak(HF.findHabit(st, 2)), 0, 'longestStreak 空习惯 0');
/* 跨月连击：7/31 + 8/1 */
const h3 = HF.addHabit(st, '跑步');
HF.toggle(st, h3.id, '2026-07-31');
HF.toggle(st, h3.id, '2026-08-01');
eq(HF.currentStreak(h3, '2026-08-01'), 2, 'currentStreak 跨月 2');
/* 跨年连击：2025-12-31 + 2026-01-01 */
const h4 = HF.addHabit(st, '冥想');
HF.toggle(st, h4.id, '2025-12-31');
HF.toggle(st, h4.id, '2026-01-01');
eq(HF.longestStreak(h4), 2, 'longestStreak 跨年 2');

/* ---- totalDone / rate ---- */
eq(HF.totalDone(h1), 8, 'totalDone 8');
eq(HF.totalDone(null), 0, 'totalDone null 安全');
/* 近 3 天（7/25~27 全勾）= 100% */
eq(HF.rate(h1, '2026-07-27', 3), 100, 'rate 近 3 天 100%');
/* 近 30 天：8 次 / 30 = 26.7% */
eq(HF.rate(h1, '2026-07-27', 30), 26.7, 'rate 近 30 天 26.7%');
eq(HF.rate(h1, '2026-07-27', 0), 0, 'rate n=0 返回 0');
eq(HF.rate(h1, 'bad-key', 7), 0, 'rate 非法 refKey 0');

/* ---- heatCells ---- */
const cells = HF.heatCells(h1, '2026-07-27', 26);
eq(cells.length, 26 * 7, 'heatCells 26 周 182 格');
/* 2026-07-27 是周一 → 本周日=08-02 是末格 */
eq(cells[cells.length - 1].key, '2026-08-02', 'heatCells 末格为本周周日');
ok(cells[cells.length - 1].future === true, 'heatCells 未来格标记');
const c727 = cells.find(c => c.key === '2026-07-27');
ok(c727 && c727.done === true && !c727.future, 'heatCells 7/27 已打卡非未来');
const c724 = cells.find(c => c.key === '2026-07-24');
ok(c724 && c724.done === false, 'heatCells 7/24 未打卡');
eq(HF.heatCells(h1, 'bad', 26), [], 'heatCells 非法 refKey 空数组');

/* ---- export / import 往返 ---- */
const json = HF.exportJSON(st);
const st2 = HF.importJSON(json);
ok(st2 !== null, 'importJSON 成功');
eq(st2.habits.length, 4, 'import 保留 4 习惯');
eq(HF.totalDone(HF.findHabit(st2, 1)), 8, 'import 保留打卡数据');
eq(st2.nextId, st.nextId, 'import 保留 nextId');
eq(HF.currentStreak(HF.findHabit(st2, 1), '2026-07-27'), 3, 'import 后 streak 一致');
/* 脏数据防御 */
eq(HF.importJSON('not json'), null, 'importJSON 乱串 null');
eq(HF.importJSON('{"app":"Other","habits":[]}'), null, 'importJSON 非本应用 null');
const dirty = HF.importJSON(JSON.stringify({
  app: 'HabitForge', version: 1,
  habits: [
    { id: 5, name: 'ok', days: { '2026-07-27': 1, 'bad-key': 1, '2026-02-30': 1 } },
    { name: '   ' },
    null
  ]
}));
ok(dirty !== null && dirty.habits.length === 1, 'importJSON 过滤脏习惯');
eq(HF.totalDone(dirty.habits[0]), 1, 'importJSON 过滤非法日期键');
eq(dirty.nextId, 6, 'importJSON nextId = maxId+1');

/* ---- removeHabit ---- */
eq(HF.removeHabit(st, 2), true, 'removeHabit 成功');
eq(st.habits.length, 3, '删除后 3 习惯');
eq(HF.removeHabit(st, 2), false, 'removeHabit 重复删除 false');

/* ---- todayKey ---- */
ok(/^\d{4}-\d{2}-\d{2}$/.test(HF.todayKey()), 'todayKey 格式合法');
ok(HF.serialOfKey(HF.todayKey()) !== null, 'todayKey 可解析');

console.log('HabitForge tests: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed ? 1 : 0);
