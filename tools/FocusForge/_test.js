// FocusForge 纯函数单测：提取 index.html 第一个 <script>（应用主脚本）在 vm 中运行，断言计时逻辑。
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
const m = html.match(/<script>([\s\S]*?)<\/script>/); // 第一个脚本 = 应用（纯函数 + DOM 守卫）
if (!m) { console.error('找不到应用 <script>'); process.exit(1); }

const sandbox = {
  module: { exports: {} }, exports: {}, console,
  Math, Date, JSON, Object, Array, String, Number, parseInt, parseFloat, isNaN, Intl
};
sandbox.window = undefined; // 确保 DOM 守卫跳过
vm.createContext(sandbox);
vm.runInContext(m[1], sandbox);
const api = sandbox.module.exports;

let pass = 0, fail = 0;
function ok(cond, name){ if (cond) { pass++; } else { fail++; console.error('  \u2717 ' + name); } }

const NEEDED = ['escapeHtml','uid','clone','fmtTime','parseDur','defaultState','pomodoroPhaseDuration',
  'pomodoroAdvance','remainingFor','addTimer','updateTimer','removeTimer','startTimer','pauseTimer',
  'resetTimer','addCity','removeCity','fmtZone','zoneOffset','exportState','importState','statsOf'];
ok(NEEDED.every(k => typeof api[k] === 'function'), 'API 导出全部纯函数');

// 1. escapeHtml
ok(api.escapeHtml('<a>&"\'') === '&lt;a&gt;&amp;&quot;&#39;', 'escapeHtml 转义五类字符');
ok(api.escapeHtml(null) === '', 'escapeHtml(null) 返回空串');

// 2. uid
ok(api.uid('t') !== api.uid('t'), 'uid 每次不同');
ok(api.uid('ff').indexOf('ff') === 0, 'uid 带前缀');

// 3. clone 深拷贝
const cp = api.clone({ a: 1, arr: [{ x: 1 }] });
cp.arr[0].x = 99;
ok(cp.arr[0].x === 99 && typeof cp.arr[0].x === 'number', 'clone 修改副本');
// 通过导出往返确认隔离：原对象不受影响（用独立对象验证）
const o1 = { list: [1, 2] };
const o2 = api.clone(o1); o2.list.push(3);
ok(o1.list.length === 2 && o2.list.length === 3, 'clone 深拷贝隔离');

// 4. fmtTime
ok(api.fmtTime(0) === '00:00', 'fmtTime(0)');
ok(api.fmtTime(65) === '01:05', 'fmtTime(65)=01:05');
ok(api.fmtTime(1500) === '25:00', 'fmtTime(1500)=25:00');
ok(api.fmtTime(3661) === '1:01:01', 'fmtTime(3661)=1:01:01（含小时）');
ok(api.fmtTime(-5) === '00:00', 'fmtTime 负数归零');

// 5. parseDur
ok(api.parseDur('25:00') === 1500, 'parseDur 25:00=1500');
ok(api.parseDur('5:30') === 330, 'parseDur 5:30=330');
ok(api.parseDur('1:0:0') === 3600, 'parseDur 1:0:0=3600');
ok(api.parseDur('5') === 300, 'parseDur 纯数字按分钟=300');
ok(api.parseDur('') === 0, 'parseDur 空串=0');
ok(api.parseDur('abc') === 0, 'parseDur 非法=0');

// 6. defaultState
const ds = api.defaultState();
ok(ds && ds.pomodoro && ds.timers && ds.stopwatch && ds.cities, 'defaultState 含四块');
ok(Array.isArray(ds.cities) && ds.cities.length === 5, 'defaultState 播种 5 个城市');
ok(ds.pomodoro.work === 25 && ds.pomodoro.remaining === 1500, 'defaultState pomodoro 默认');

// 7. pomodoroPhaseDuration
const cfg = ds.pomodoro;
ok(api.pomodoroPhaseDuration(cfg, 'work') === 1500, 'phaseDuration work=1500');
ok(api.pomodoroPhaseDuration(cfg, 'short') === 300, 'phaseDuration short=300');
ok(api.pomodoroPhaseDuration(cfg, 'long') === 900, 'phaseDuration long=900');

// 8. pomodoroAdvance
let p = api.pomodoroAdvance(cfg); // 从 work 推进
ok(p.phase === 'short', 'advance(work)→short');
ok(p.completed === 1, 'advance(work) completed=1');
ok(p.todayCount === 1, 'advance(work) todayCount=1');
p = api.pomodoroAdvance({ phase:'short', completed:1, longEvery:4, today:'2026-01-01', todayCount:1 });
ok(p.phase === 'work', 'advance(short)→work');
// longEvery=4：第 4 个专注后应为 long
let p4 = { phase:'work', completed:3, longEvery:4, today:'2026-01-01', todayCount:3 };
p4 = api.pomodoroAdvance(p4);
ok(p4.completed === 4 && p4.phase === 'long', '第 4 个专注后→long');
let pl = api.pomodoroAdvance({ phase:'long', completed:4, longEvery:4, today:'2026-01-01', todayCount:4 });
ok(pl.phase === 'work', 'advance(long)→work');

// 9. remainingFor
const base = Date.now();
const tRun = { total: 100, remaining: 100, running: true, startedAt: base - 50000 }; // 50s 前开始
ok(Math.abs(api.remainingFor(tRun, base) - 50) < 1.5, 'remainingFor 运行中按时间递减≈50');
const tStop = { total: 100, remaining: 30, running: false, startedAt: null };
ok(api.remainingFor(tStop, base) === 30, 'remainingFor 暂停返回 remaining');

// 10. addTimer（不可变）
let st = ds;
st = api.addTimer(st, '泡茶', 300);
ok(st.timers.length === 1 && ds.timers.length === 0, 'addTimer 不改原状态');
ok(st.timers[0].name === '泡茶' && st.timers[0].total === 300 && st.timers[0].remaining === 300, 'addTimer 字段正确');
st = api.addTimer(st, '', 0); // 时长 0 归 1
ok(st.timers[1].total === 1, 'addTimer 时长下限为 1');

// 11. updateTimer
st = api.updateTimer(st, st.timers[0].id, { name: '咖啡' });
ok(st.timers[0].name === '咖啡', 'updateTimer 改名');
ok(ds.timers.length === 0, 'updateTimer 不改原状态');

// 12. removeTimer
const rmId = st.timers[0].id;
st = api.removeTimer(st, rmId);
ok(st.timers.length === 1 && !st.timers.some(t => t.id === rmId), 'removeTimer 删除');

// 13. startTimer / pauseTimer / resetTimer
let t = { id:'x', name:'a', total:600, remaining:600, running:false, startedAt:null };
let ts = api.startTimer(t, base);
ok(ts.running === true && typeof ts.startedAt === 'number', 'startTimer 开始');
ok(t.running === false, 'startTimer 不改原对象');
let zero = { id:'z', name:'b', total:600, remaining:0, running:false, startedAt:null };
ok(api.startTimer(zero, base).remaining === 600, 'startTimer remaining=0 自动重置为 total');
let tp = api.pauseTimer(ts, base + 30000); // 30s 后暂停
ok(tp.running === false && tp.startedAt === null, 'pauseTimer 清运行状态');
ok(Math.abs(tp.remaining - 570) < 2, 'pauseTimer remaining 反映已用时间≈570');
let tr = api.resetTimer(tp);
ok(tr.running === false && tr.remaining === 600, 'resetTimer 复位 total');

// 14. addCity / removeCity
st = api.addCity(ds, '巴黎', 'Europe/Paris');
ok(st.cities.length === 6 && ds.cities.length === 5, 'addCity 不改原状态');
ok(st.cities[5].name === '巴黎' && st.cities[5].tz === 'Europe/Paris', 'addCity 字段');
st = api.removeCity(st, st.cities[5].id);
ok(st.cities.length === 5, 'removeCity 删除');

// 15. fmtZone / zoneOffset
const d = new Date('2026-06-01T12:00:00Z');
const sh = api.fmtZone('Asia/Shanghai', d);
const ny = api.fmtZone('America/New_York', d);
ok(typeof sh === 'string' && sh.length > 0 && sh.indexOf(':') >= 0, 'fmtZone 返回带冒号的时间串');
ok(sh !== ny, 'fmtZone 不同时区结果不同');
ok(api.fmtZone('Invalid/Zone', d) === '—', 'fmtZone 非法时区返回 —');
const os = api.zoneOffset('Asia/Shanghai', d);
const ony = api.zoneOffset('America/New_York', d);
ok(typeof os === 'string' && os.length > 0, 'zoneOffset 返回非空');
ok(os !== ony, 'zoneOffset 不同时区不同');
ok(api.zoneOffset('Invalid/Zone', d) === '', 'zoneOffset 非法时区返回空');

// 16. exportState / importState 往返
const json = api.exportState(ds);
const imp = api.importState(json);
ok(imp.cities.length === 5, 'export→import 城市数一致');
ok(imp.pomodoro.work === 25, 'export→import 保留 pomodoro');
ok(imp.timers.length === 0, 'export→import 默认无计时器');
let threw = false; try { api.importState('{bad'); } catch (e) { threw = true; }
ok(threw, 'importState 非法 JSON 抛错');
const partial = api.importState(JSON.stringify({ pomodoro: { work: 50, phase: 'short' } }));
ok(partial.pomodoro.work === 50 && partial.pomodoro.phase === 'short', 'importState 合并部分 pomodoro');
ok(partial.cities.length === 5, 'importState 缺字段用默认补齐');
const withTimer = api.importState(JSON.stringify({ timers: [{ name: 'x', total: 42 }] }));
ok(withTimer.timers.length === 1 && withTimer.timers[0].total === 42 && withTimer.timers[0].remaining === 42, 'importState 补齐计时器 remaining');

// 17. statsOf
const stt = api.addTimer(ds, 'a', 100);
const s0 = api.statsOf(ds);
ok(s0.timers === 0 && s0.cities === 5 && s0.running === 0 && s0.totalSeconds === 0, 'statsOf 默认');
const s1 = api.statsOf(stt);
ok(s1.timers === 1 && s1.totalSeconds === 100, 'statsOf 含计时器统计');

console.log('\nFocusForge 纯函数测试: ' + pass + ' 通过, ' + fail + ' 失败');
process.exit(fail ? 1 : 0);
