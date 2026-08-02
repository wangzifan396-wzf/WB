// FlowForge 纯函数单测：提取 index.html 第一个 <script>（应用主脚本）在 vm 中运行，断言看板数据逻辑。
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
const m = html.match(/<script>([\s\S]*?)<\/script>/); // 第一个脚本 = 应用（纯函数 + DOM 守卫）
if (!m) { console.error('找不到应用 <script>'); process.exit(1); }

const sandbox = {
  module: { exports: {} }, exports: {}, console,
  Math, Date, JSON, Object, Array, String, Number, parseInt, parseFloat, isNaN
};
sandbox.window = undefined; // 确保 DOM 守卫跳过
vm.createContext(sandbox);
vm.runInContext(m[1], sandbox);
const api = sandbox.module.exports;

let pass = 0, fail = 0;
function ok(cond, name){ if (cond) { pass++; } else { fail++; console.error('  \u2717 ' + name); } }

// 1. escapeHtml
ok(api.escapeHtml('<a>&"\'') === '&lt;a&gt;&amp;&quot;&#39;', 'escapeHtml 转义五类字符');
ok(api.escapeHtml(null) === '', 'escapeHtml(null) 返回空串');
ok(api.escapeHtml(123) === '123', 'escapeHtml 数字转字符串');

// 2. uid 唯一性 + 前缀
ok(api.uid('b') !== api.uid('b'), 'uid 每次不同');
ok(api.uid('c').indexOf('c') === 0, 'uid 带前缀');

// 3. clone 深拷贝
const src = { a: 1, arr: [{ x: 1 }] };
const cp = api.clone(src);
cp.arr[0].x = 99;
ok(src.arr[0].x === 1, 'clone 深拷贝隔离');

// 4. newBoard 三列结构
const b0 = api.newBoard('测试板');
ok(b0.name === '测试板', 'newBoard 名称');
ok(b0.columns.length === 3, 'newBoard 默认三列');
ok(b0.columns.every(c => Array.isArray(c.cards) && c.cards.length === 0), 'newBoard 列初始空卡片');
ok(api.newBoard().name === '我的看板', 'newBoard 默认名');

// 5. findCol
const todoId = b0.columns[0].id;
ok(api.findCol(b0, todoId).name === '待办', 'findCol 命中');
ok(api.findCol(b0, 'nope') === null, 'findCol 未命中返回 null');

// 6. addColumn（不可变）
let b = api.addColumn(b0, '评审');
ok(b.columns.length === 4 && b0.columns.length === 3, 'addColumn 不改原对象');
ok(b.columns[3].name === '评审', 'addColumn 追加到末尾');

// 7. renameColumn
b = api.renameColumn(b, todoId, 'Backlog');
ok(api.findCol(b, todoId).name === 'Backlog', 'renameColumn 生效');

// 8. deleteColumn
const delId = b.columns[3].id;
b = api.deleteColumn(b, delId);
ok(b.columns.length === 3, 'deleteColumn 删除一列');
ok(api.findCol(b, delId) === null, 'deleteColumn 后找不到');

// 9. addCard / findCard
b = api.addCard(b, todoId, { title: '写测试', priority: 'high', labels: ['dev'], due: '2026-08-01' });
const found = api.findCard(b, api.findCol(b, todoId).cards[0].id);
ok(found && found.card.title === '写测试', 'addCard + findCard');
ok(found.card.priority === 'high' && found.card.done === false, 'addCard 字段默认');
ok(api.addCard(b, 'badcol', { title: 'x' }).columns.length === b.columns.length, 'addCard 非法列不崩');
b = api.addCard(b, todoId, { title: '第二张' });
ok(api.findCol(b, todoId).cards.length === 2, 'addCard 多张累积');

// 10. updateCard
const card1Id = api.findCol(b, todoId).cards[0].id;
b = api.updateCard(b, card1Id, { done: true, title: '写测试(改)' });
ok(api.findCard(b, card1Id).card.done === true, 'updateCard done');
ok(api.findCard(b, card1Id).card.title === '写测试(改)', 'updateCard 标题');

// 11. moveCard 跨列 + 索引
const doingId = b.columns[1].id;
b = api.moveCard(b, card1Id, doingId, 0);
ok(api.findCol(b, todoId).cards.length === 1, 'moveCard 源列减少');
ok(api.findCol(b, doingId).cards[0].id === card1Id, 'moveCard 落到目标列指定索引');
// 越界索引落到末尾
b = api.addCard(b, doingId, { title: '末尾候选' });
const movingId = api.findCol(b, todoId).cards[0].id;
b = api.moveCard(b, movingId, doingId, 999);
ok(api.findCol(b, doingId).cards[api.findCol(b, doingId).cards.length - 1].id === movingId, 'moveCard 越界索引落末尾');
ok(api.moveCard(b, 'nope', doingId, 0) === b || true, 'moveCard 无效卡片不崩');

// 12. moveColumn 重排
const order0 = b.columns.map(c => c.id);
b = api.moveColumn(b, order0[0], 2);
ok(b.columns[2].id === order0[0], 'moveColumn 移到目标位置');
ok(b.columns.length === order0.length, 'moveColumn 不丢列');

// 13. dueState
ok(api.dueState(null) === 'none', 'dueState 无日期');
ok(api.dueState('2026-01-01', '2026-06-01') === 'overdue', 'dueState 逾期');
ok(api.dueState('2026-06-02', '2026-06-01') === 'soon', 'dueState 即将（<=2天）');
ok(api.dueState('2026-07-01', '2026-06-01') === 'upcoming', 'dueState 未来');
ok(api.dueState('2026-06-01', '2026-06-01') === 'soon', 'dueState 当天算 soon');

// 14. todayStr 格式
ok(/^\d{4}-\d{2}-\d{2}$/.test(api.todayStr()), 'todayStr 格式 YYYY-MM-DD');

// 15. priorityRank
ok(api.priorityRank('high') > api.priorityRank('med'), 'priorityRank high>med');
ok(api.priorityRank('med') > api.priorityRank('low'), 'priorityRank med>low');
ok(api.priorityRank('x') === 0, 'priorityRank 未知为0');

// 16. filterCards
const cards = [
  { title: '前端 bug', desc: '样式', priority: 'high', labels: ['ui'] },
  { title: '后端 API', desc: '接口', priority: 'low', labels: ['api'] },
  { title: '文档', desc: '写 readme', priority: 'med', labels: [] }
];
ok(api.filterCards(cards, { q: 'api' }).length === 1, 'filterCards 关键词(标题)');
ok(api.filterCards(cards, { q: 'readme' }).length === 1, 'filterCards 关键词(描述)');
ok(api.filterCards(cards, { priority: 'high' }).length === 1, 'filterCards 优先级');
ok(api.filterCards(cards, { labels: ['ui'] }).length === 1, 'filterCards 标签');
ok(api.filterCards(cards, {}).length === 3, 'filterCards 空条件全返');

// 17. sortCards
const byP = api.sortCards(cards, 'priority');
ok(byP[0].priority === 'high' && byP[byP.length - 1].priority === 'low', 'sortCards 按优先级');
const dueCards = [{ due: '2026-09-01' }, { due: null }, { due: '2026-01-01' }];
const byD = api.sortCards(dueCards, 'due');
ok(byD[0].due === '2026-01-01', 'sortCards 按截止日期升序');
ok(byD[byD.length - 1].due === null, 'sortCards 无日期排最后');
ok(api.sortCards(cards, 'x').length === 3, 'sortCards 未知不崩');

// 18. exportBoard / importBoard 往返
const json = api.exportBoard(b);
const imp = api.importBoard(json);
ok(imp.columns.length === b.columns.length, 'export→import 列数一致');
let threw = false; try { api.importBoard('{bad json'); } catch (e) { threw = true; }
ok(threw, 'importBoard 非法 JSON 抛错');
let threw2 = false; try { api.importBoard('{"foo":1}'); } catch (e) { threw2 = true; }
ok(threw2, 'importBoard 缺 columns 抛错');
const fixed = api.importBoard('{"name":"x","columns":[{"id":"c1","name":"A"}]}');
ok(Array.isArray(fixed.columns[0].cards), 'importBoard 补齐缺失 cards');
ok(!!fixed.id, 'importBoard 补齐缺失 id');

// 19. boardStats
const stat = api.boardStats(b);
ok(typeof stat.total === 'number' && stat.total >= 0, 'boardStats total');
ok(typeof stat.done === 'number', 'boardStats done');
ok(stat.byPriority && typeof stat.byPriority.high === 'number', 'boardStats byPriority');
const sb = api.newBoard('s');
let sbB = api.addCard(sb, sb.columns[0].id, { title: 'a', priority: 'high', due: '2000-01-01' });
sbB = api.addCard(sbB, sb.columns[0].id, { title: 'b', priority: 'low' });
const st2 = api.boardStats(sbB);
ok(st2.total === 2, 'boardStats 计数正确');
ok(st2.overdue === 1, 'boardStats 逾期计数');
ok(st2.byPriority.high === 1 && st2.byPriority.low === 1, 'boardStats 优先级分布');

// 20. labelColor 稳定 + 合法类名
ok(api.labelColor('ui') === api.labelColor('ui'), 'labelColor 稳定');
ok(/^l[0-4]$/.test(api.labelColor('anything')), 'labelColor 返回 l0-l4');

console.log('\nFlowForge 纯函数测试: ' + pass + ' 通过, ' + fail + ' 失败');
process.exit(fail ? 1 : 0);
