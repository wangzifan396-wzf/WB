// MindForge pure-function unit tests + zero-external-link check.
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
// 自有域名回链（页脚指向工具矩阵）是 <a> 锚点，不产生外部请求，扫描时剔除
const OWN_LINK = /https?:\/\/(?:github\.com\/wangzifan396-wzf|wangzifan396-wzf\.github\.io)[^\s"'>]*/g;
const htmlExt = html.replace(OWN_LINK, '');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { console.error('FAIL: inline <script> not found'); process.exit(1); }

const mod = { exports: {} };
new Function('module', 'exports', 'require', m[1])(mod, mod.exports);
const fns = mod.exports;

let pass = 0, fail = 0;
function eq(name, got, want) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  console.log((ok ? '✓' : '✗') + ' ' + name + '  got=' + JSON.stringify(got) + (ok ? '' : ' want=' + JSON.stringify(want)));
  ok ? pass++ : fail++;
}
function ok(name, cond) {
  console.log((cond ? '✓' : '✗') + ' ' + name);
  cond ? pass++ : fail++;
}

const { addNode, removeNode, moveNode, toggleCollapse, layout, exportJSON, importJSON, searchNodes, escapeHtml, sanitize } = fns;

// 1. addNode
let nodes = [];
nodes = addNode(nodes, { parentId: null, text: 'root' });           // n1
nodes = addNode(nodes, { parentId: 'n1', text: 'child A' });         // n2
nodes = addNode(nodes, { parentId: 'n1', text: 'child B' });         // n3
nodes = addNode(nodes, { parentId: 'n2', text: 'grandchild' });      // n4
eq('addNode count', nodes.length, 4);
ok('addNode root id', nodes[0].id === 'n1' && nodes[0].parentId === null);
ok('addNode shape', nodes[1].hasOwnProperty('color') && nodes[1].hasOwnProperty('collapsed') && nodes[1].hasOwnProperty('x') && nodes[1].hasOwnProperty('y'));

// 2. removeNode (removes subtree)
let after = removeNode(nodes, 'n2');
eq('removeNode subtree', after.length, 2);
ok('removeNode keeps n1,n3', after.some(n => n.id === 'n1') && after.some(n => n.id === 'n3') && !after.some(n => n.id === 'n4'));

// 3. moveNode (position + reparent, no cycle)
nodes = moveNode(nodes, 'n3', 500, 300);
let n3 = nodes.find(n => n.id === 'n3');
ok('moveNode sets pos + manual', n3.x === 500 && n3.y === 300 && n3.manual === true);
// cycle guard: moving n1 under n4 (descendant of n1) must be rejected
nodes = moveNode(nodes, 'n1', undefined, undefined, 'n4');
ok('moveNode rejects cycle', nodes.find(n => n.id === 'n1').parentId === null);
// valid reparent n3 under n2
nodes = moveNode(nodes, 'n3', undefined, undefined, 'n2');
ok('moveNode reparent', nodes.find(n => n.id === 'n3').parentId === 'n2');

// 4. toggleCollapse
nodes = toggleCollapse(nodes, 'n1');
ok('toggleCollapse true', nodes.find(n => n.id === 'n1').collapsed === true);
nodes = toggleCollapse(nodes, 'n1');
ok('toggleCollapse false', nodes.find(n => n.id === 'n1').collapsed === false);

// 5. layout (returns positioned nodes)
let pos = layout(nodes);
eq('layout length', pos.length, nodes.length);
ok('layout all positioned', pos.every(n => typeof n.x === 'number' && typeof n.y === 'number'));
ok('layout hidden under collapsed', (() => {
  let t = toggleCollapse(nodes, 'n1');
  let lp = layout(t);
  return lp.find(n => n.id === 'n2').x === null; // n2 hidden
})());

// 6. exportJSON / importJSON round-trip + invalid rejection
let json = exportJSON(nodes);
let back = importJSON(json);
ok('importJSON round-trip ok', back.ok === true && back.nodes.length === nodes.length);
ok('importJSON text preserved', back.ok && back.nodes.find(n => n.id === 'n1').text === nodes.find(n => n.id === 'n1').text);
ok('importJSON rejects bad json', importJSON('{not json').ok === false);
ok('importJSON rejects missing nodes', importJSON('{"foo":1}').ok === false);
ok('importJSON rejects bad shape', importJSON('{"nodes":[{"id":"x"}]}').ok === false);
ok('importJSON accepts bare array', importJSON('[{"id":"a","parentId":null,"text":"t"}]').ok === true);

// 7. searchNodes
ok('searchNodes match', JSON.stringify(searchNodes(nodes, 'root')) === JSON.stringify(['n1']));
ok('searchNodes case-insensitive', searchNodes(nodes, 'CHILD A').indexOf('n2') >= 0);
eq('searchNodes no query', searchNodes(nodes, ''), []);

// 8. escapeHtml / sanitize
eq('escapeHtml', escapeHtml('<a>&"\''), '&lt;a&gt;&amp;&quot;&#39;');
eq('sanitize == escapeHtml', sanitize('<b>'), escapeHtml('<b>'));

// 9. ZERO-EXTERNAL-LINK check
ok('no <script src', !/<script[^>]+src\s*=/i.test(html));
ok('no <link href="http', !/<link[^>]+href\s*=\s*["']https?:/i.test(html));
const httpOccurrences = [...htmlExt.matchAll(/(https?:\/\/[^\s"'>]+)/g)].map(x => x[1]);
const comments = html.match(/<!--[\s\S]*?-->/g) || [];
let externalBad = false;
httpOccurrences.forEach(u => {
  const inComment = comments.some(c => c.includes(u));
  if (!inComment) externalBad = true;
  else if (!/github\.io/.test(comments.find(c => c.includes(u)))) externalBad = true;
});
ok('zero external http links' + (httpOccurrences.length ? ' (allowed: github.io in comment)' : ''), !externalBad);
ok('exactly one inline <script>', (html.match(/<script>/g) || []).length === 1);

console.log(`\n结果: ${pass} 通过 / ${fail} 失败`);
process.exit(fail ? 1 : 0);
