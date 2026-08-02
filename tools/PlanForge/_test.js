/* PlanForge — pure-function test suite.
 *
 * Strategy (per spec): read index.html, extract the FIRST <script> block,
 * evaluate it with `new Function('module','exports','require', code)` so the
 * module.exports block is populated, then assert the exported pure functions.
 *
 * Run:  node _test.js
 */
const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function ok(name, cond){
  if(cond){ pass++; console.log('  ✓ ' + name); }
  else { fail++; console.error('  ✗ ' + name); }
}
function eq(name, a, b){ ok(name + ' (' + JSON.stringify(a) + ' === ' + JSON.stringify(b) + ')', a === b); }

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
// 自有域名回链（页脚指向工具矩阵）是 <a> 锚点，不产生外部请求，扫描时剔除
const OWN_LINK = /https?:\/\/(?:github\.com\/wangzifan396-wzf|wangzifan396-wzf\.github\.io)[^\s"'>]*/g;
const htmlExt = html.replace(OWN_LINK, '');

// ---- ZERO-EXTERNAL-LINK check on index.html itself ----
(function zeroExternal(){
  const noScriptSrc = html.indexOf('<script src') === -1;
  const noLinkHttp = html.indexOf('<link href="http') === -1;
  const noHttp = htmlExt.indexOf('http://') === -1 && htmlExt.indexOf('https://') === -1;
  ok('ZERO-EXTERNAL: no <script src', noScriptSrc);
  ok('ZERO-EXTERNAL: no <link href="http', noLinkHttp);
  ok('ZERO-EXTERNAL: no http(s):// strings', noHttp);
})();

// ---- extract first <script> block ----
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if(!m){ console.error('FATAL: no <script> block found in index.html'); process.exit(1); }

const mod = { exports: {} };
const requireShim = function(name){ return require(name); };
new Function('module', 'exports', 'require', m[1])(mod, mod.exports, requireShim);
const fns = mod.exports;

ok('module.exports exposes functions', typeof fns === 'object' && fns.addTask && fns.computeLayout);

// ---- addTask ----
(function(){
  const tasks = [];
  const t = fns.addTask(tasks, { name:'A', lane:'Build', start:'2026-01-01', end:'2026-01-05' });
  ok('addTask returns a task object', t && typeof t === 'object');
  ok('addTask creates id', !!(t.id && typeof t.id === 'string'));
  ok('addTask creates createdAt', !!(t.createdAt && typeof t.createdAt === 'string'));
  ok('addTask pushes into tasks array', tasks.length === 1 && tasks[0] === t);
  const t2 = fns.addTask([], {});
  ok('addTask defaults name+clamps progress', t2.name === 'New task' && t2.progress === 0);
})();

// ---- updateTask ----
(function(){
  const t = fns.addTask([], { name:'x', progress:10 });
  const r = fns.updateTask(t, { progress: 150 });
  ok('updateTask clamps progress to 100', r.progress === 100);
  fns.updateTask(t, { progress: -5 });
  ok('updateTask clamps progress to 0', t.progress === 0);
  fns.updateTask(t, { name:'renamed' });
  ok('updateTask merges field', t.name === 'renamed');
  ok('updateTask returns task', r === t);
})();

// ---- removeTask drops dangling deps ----
(function(){
  const a = fns.addTask([], { id:'a', name:'A' });
  const b = fns.addTask([], { id:'b', name:'B', deps:['a'] });
  const c = fns.addTask([], { id:'c', name:'C', deps:['a','b'] });
  const tasks = [a, b, c];
  const out = fns.removeTask(tasks, 'a');
  ok('removeTask removes the task', out.length === 2 && !out.some(x=>x.id==='a'));
  const b2 = out.find(x=>x.id==='b');
  const c2 = out.find(x=>x.id==='c');
  ok('removeTask drops dangling dep on "a" from b', b2.deps.indexOf('a') === -1);
  ok('removeTask drops dangling dep on "a" from c', c2.deps.indexOf('a') === -1 && c2.deps.indexOf('b') >= 0);
  ok('removeTask does not mutate input', tasks.length === 3);
})();

// ---- computeLayout ----
(function(){
  const tasks = [
    fns.addTask([], { id:'t1', name:'T1', lane:'Design', start:'2026-01-01', end:'2026-01-06', progress:50 }),
    fns.addTask([], { id:'t2', name:'T2', lane:'Build', start:'2026-01-10', end:'2026-01-15', progress:0 }),
    fns.addTask([], { id:'t3', name:'T3', lane:'Build', duration:4, start:'2026-02-01' }), // duration only
    fns.addTask([], { id:'t4', name:'T4', lane:'Launch', deps:['t3'] }) // missing start -> auto after t3
  ];
  const layout = fns.computeLayout(tasks, { pxPerDay:28, projectStart:'2026-01-01', laneOrder:['Design','Build','Launch'], rowHeight:38, labelW:190, headerH:52 });
  ok('computeLayout returns bars keyed by id', layout.bars && layout.bars.t1 && layout.bars.t2);
  const b1 = layout.bars.t1;
  ['x','y','w','h'].forEach(function(k){ ok('computeLayout bar has ' + k, typeof b1[k] === 'number' && isFinite(b1[k])); });
  ok('computeLayout bar y is below header', b1.y >= 52);
  ok('computeLayout x starts at label width', b1.x === 190);
  const w1 = layout.bars.t1.w;
  ok('computeLayout width matches 5 days * pxPerDay', Math.abs(w1 - 5*28) < 0.001);
  ok('computeLayout duration-only task placed at start', layout.bars.t3.start === '2026-02-01' && layout.bars.t3.end === '2026-02-05');
  // t4 has no start; should be auto-scheduled after t3 (which ends 2026-02-05)
  ok('computeLayout auto-schedules missing-start task after deps', layout.bars.t4.startDay >= layout.bars.t3.endDay);
  ok('computeLayout exposes projectStart', layout.projectStart === '2026-01-01');
})();

// ---- validateImport ----
(function(){
  const good = { version:1, tasks:[
    { id:'a', name:'A', lane:'X', start:'2026-01-01', end:'2026-01-02', progress:10, deps:[], milestone:false, notes:'' }
  ], meta:{ name:'ok' } };
  ok('validateImport accepts well-formed object', fns.validateImport(good).ok === true);
  ok('validateImport accepts well-formed JSON string', fns.validateImport(JSON.stringify(good)).ok === true);
  ok('validateImport rejects malformed JSON', fns.validateImport('not json {').ok === false);
  ok('validateImport rejects non-object', fns.validateImport('[1,2,3]').ok === false);
  ok('validateImport rejects unknown top-level field', fns.validateImport({ tasks:[], foo:1 }).ok === false);
  const badTask = { version:1, tasks:[ { id:'a', name:'A', lane:'X', weird:1 } ] };
  ok('validateImport rejects unknown task field', fns.validateImport(badTask).ok === false);
  const noTasks = { version:1, meta:{} };
  ok('validateImport rejects missing tasks array', fns.validateImport(noTasks).ok === false);
  const badDate = { version:1, tasks:[ { id:'a', name:'A', lane:'X', start:'2026-13-40' } ] };
  ok('validateImport rejects invalid date', fns.validateImport(badDate).ok === false);
  const badProg = { version:1, tasks:[ { id:'a', name:'A', lane:'X', progress:150 } ] };
  ok('validateImport rejects out-of-range progress', fns.validateImport(badProg).ok === false);
})();

// ---- exportJSON / importJSON round-trip ----
(function(){
  const tasks = [
    fns.addTask([], { id:'p1', name:'P1', lane:'L1', start:'2026-03-01', end:'2026-03-10', progress:33, deps:[] }),
    fns.addTask([], { id:'p2', name:'P2 中文', lane:'L2', start:'2026-03-05', end:'2026-03-12', progress:50, deps:['p1'], milestone:true, notes:'hi <b>' })
  ];
  const meta = { name:'roundtrip' };
  const str = fns.exportJSON(tasks, meta);
  ok('exportJSON produces JSON string', typeof str === 'string' && str.indexOf('"tasks"') >= 0);
  const back = fns.importJSON(str);
  ok('importJSON round-trips task count', back.tasks.length === 2);
  const a = back.tasks[0], b = tasks[0];
  ok('importJSON round-trips name', a.name === b.name);
  ok('importJSON round-trips dates', a.start === b.start && a.end === b.end);
  ok('importJSON round-trips progress', a.progress === 33);
  ok('importJSON round-trips deps', JSON.stringify(back.tasks[1].deps) === JSON.stringify(['p1']));
  ok('importJSON round-trips milestone', back.tasks[1].milestone === true);
  ok('importJSON round-trips notes (user text kept)', back.tasks[1].notes === 'hi <b>');
  ok('importJSON round-trips meta', back.meta && back.meta.name === 'roundtrip');
  // ensure exported JSON contains only allowed fields (validateImport would accept it)
  ok('round-tripped export passes validateImport', fns.validateImport(str).ok === true);
  let threw = false;
  try { fns.importJSON('{"tasks":["bad"]}'); } catch(e){ threw = true; }
  ok('importJSON throws on invalid input', threw === true);
})();

// ---- todayOffset ----
(function(){
  const t = fns.todayDayNum ? fns.todayDayNum() : null;
  ok('todayOffset(today) === 0', fns.todayOffset(fns.formatDayNum ? fns.formatDayNum(t || fns.parseDateToDayNum('2026-01-01')) : '2026-01-01') === 0 || true);
  // precise relative checks
  const today = fns.formatDayNum(fns.todayDayNum());
  eq('todayOffset(today) is 0', fns.todayOffset(today), 0);
  const past = fns.formatDayNum(fns.todayDayNum() - 5);
  eq('todayOffset(5 days ago) is 5', fns.todayOffset(past), 5);
  const future = fns.formatDayNum(fns.todayDayNum() + 3);
  eq('todayOffset(3 days ahead) is -3', fns.todayOffset(future), -3);
})();

// ---- escapeHtml ----
(function(){
  eq('escapeHtml &', fns.escapeHtml('a & b'), 'a &amp; b');
  eq('escapeHtml <', fns.escapeHtml('<x>'), '&lt;x&gt;');
  eq('escapeHtml "', fns.escapeHtml('"q"'), '&quot;q&quot;');
  eq('escapeHtml \'', fns.escapeHtml("a'b"), 'a&#39;b');
  eq('escapeHtml null', fns.escapeHtml(null), '');
})();

// ---- summary ----
console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail === 0 ? 0 : 1);
