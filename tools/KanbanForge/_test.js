// KanbanForge pure function tests (Node, no deps)
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { console.error('FAIL: no <script> found'); process.exit(1); }

const mod = { exports: {} };
new Function('module', 'exports', 'require', m[1])(mod, mod.exports, require);
const P = mod.exports;

let pass = 0, fail = 0;
function t(name, cond) {
  if (cond) { pass++; console.log('  PASS', name); }
  else { fail++; console.error('  FAIL', name); }
}

// esc
t('esc html', P.esc('<a b="c">&') === '&lt;a b=&quot;c&quot;&gt;&amp;');
t('esc null', P.esc(null) === '');

// uid
t('uid unique', P.uid() !== P.uid());

// defaultBoard
const b = P.defaultBoard();
t('default 3 columns', b.columns.length === 3);
t('default has cards', b.columns[0].cards.length === 2);

// add/remove column
const col = P.addColumn(b, '测试列');
t('addColumn', b.columns.length === 4 && col.title === '测试列');
t('removeColumn', P.removeColumn(b, col.id) === true && b.columns.length === 3);
t('removeColumn missing', P.removeColumn(b, 'nope') === false);

// add/remove card
const card = P.addCard(b, b.columns[0].id, '新任务');
t('addCard', card && b.columns[0].cards.length === 3);
t('addCard bad col', P.addCard(b, 'nope', 'x') === null);
t('findCard', P.findCard(b, card.id).card.title === '新任务');

// moveCard
t('moveCard to col3', P.moveCard(b, card.id, b.columns[2].id, 0) === true);
t('moveCard landed', b.columns[2].cards[0].id === card.id && b.columns[0].cards.length === 2);
t('moveCard bad', P.moveCard(b, 'nope', b.columns[0].id, 0) === false);
t('removeCard', P.removeCard(b, card.id) === true && b.columns[2].cards.length === 0);

// parseTags
t('parseTags', JSON.stringify(P.parseTags(' a, b ，c,,')) === JSON.stringify(['a','b','c']));

// matchCard
const mc = { title: 'Fix login bug', desc: 'urgent thing', tags: ['auth', 'backend'] };
t('match title', P.matchCard(mc, 'login') === true);
t('match desc', P.matchCard(mc, 'URGENT') === true);
t('match tag #', P.matchCard(mc, '#auth') === true);
t('match tag # miss', P.matchCard(mc, '#front') === false);
t('match empty', P.matchCard(mc, '') === true);

// boardStats
const b2 = P.defaultBoard();
const st = P.boardStats(b2);
t('stats columns', st.columns === 3);
t('stats cards', st.cards === 3);
t('stats high', st.high === 1);

// toMarkdown
const md = P.toMarkdown(b2);
t('md has heading', md.indexOf('## 待办 (2)') >= 0);
t('md has task', md.indexOf('- [ ] 体验 KanbanForge') >= 0);
t('md has tag', md.indexOf('#本地优先') >= 0);

// toJSON / fromJSON roundtrip
const j = P.toJSON(b2);
const back = P.fromJSON(j);
t('json roundtrip', JSON.stringify(back) === JSON.stringify(b2));
let threw = false;
try { P.fromJSON('{"columns": "bad"}'); } catch (e) { threw = true; }
t('fromJSON rejects invalid', threw);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
