/* SnipForge — pure-function unit tests (Node, no deps).
 *
 * Loads index.html, extracts the FIRST <script> block, evaluates it with a
 * tiny CommonJS shim, then asserts the exported pure functions. Also asserts
 * the hard offline-first / zero-external-link contract.
 */
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
// 自有域名回链（页脚指向工具矩阵）是 <a> 锚点，不产生外部请求，扫描时剔除
const OWN_LINK = /https?:\/\/(?:github\.com\/wangzifan396-wzf|wangzifan396-wzf\.github\.io)[^\s"'>]*/g;
const htmlExt = html.replace(OWN_LINK, '');

let pass = 0, fail = 0;
function ok(name, cond) {
  if (cond) { pass++; console.log('  \u2713 ' + name); }
  else { fail++; console.log('  \u2717 ' + name); }
}

// Extract first <script> block (must be a bare <script>, no src=).
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { console.error('FATAL: no <script> block found in index.html'); process.exit(1); }

const mod = { exports: {} };
// Evaluate the extracted source as a module (window is undefined -> UI guard skipped).
new Function('module', 'exports', 'require', m[1])(mod, mod.exports, require);
const fns = mod.exports;

ok('module.exports exposes functions', fns && typeof fns.addSnippet === 'function');

// ---- addSnippet ----
const a = fns.addSnippet({ title: 'Hi', code: 'x = 1' });
ok('addSnippet returns object', a && typeof a === 'object');
ok('addSnippet assigns id', typeof a.id === 'string' && a.id.length > 0);
ok('addSnippet assigns createdAt', typeof a.createdAt === 'string' && a.createdAt.length > 0);
ok('addSnippet defaults folder', a.folder === 'General');
ok('addSnippet normalizes tags array', Array.isArray(a.tags) && a.tags.length === 0);

// ---- removeSnippet ----
const list = [a, fns.addSnippet({ title: 'B', code: 'y' })];
const rem = fns.removeSnippet(list, a.id);
ok('removeSnippet removes by id', rem.length === 1 && rem[0].id === list[1].id);
ok('removeSnippet is immutable', list.length === 2);

// ---- updateSnippet ----
const u = fns.updateSnippet(a, { title: 'New' });
ok('updateSnippet merges field', u.title === 'New' && u.code === 'x = 1');
ok('updateSnippet sets updatedAt', typeof u.updatedAt === 'string');
ok('updateSnippet keeps id', u.id === a.id);

// ---- toggleFavorite ----
const t = fns.toggleFavorite(a);
ok('toggleFavorite flips fav', t.fav === true && a.fav === false);

// ---- searchSnippets ----
const data = [
  fns.addSnippet({ title: 'Alpha', code: 'SELECT 1', tags: ['db'] }),
  fns.addSnippet({ title: 'Beta', code: 'curl x', tags: ['net'] }),
  fns.addSnippet({ title: 'Gamma', code: 'flex', tags: ['css'] })
];
ok('searchSnippets matches title (ci)', fns.searchSnippets(data, 'alpha').length === 1);
ok('searchSnippets matches code (ci)', fns.searchSnippets(data, 'SELECT').length === 1);
ok('searchSnippets matches tag (ci)', fns.searchSnippets(data, 'NET').length === 1);
ok('searchSnippets empty -> all', fns.searchSnippets(data, '').length === 3);
ok('searchSnippets no match -> 0', fns.searchSnippets(data, 'zzz').length === 0);

// ---- filterByLang ----
const langs = [
  fns.addSnippet({ title: 'j', code: '', lang: 'javascript' }),
  fns.addSnippet({ title: 'p', code: '', lang: 'python' })
];
ok('filterByLang filters', fns.filterByLang(langs, 'python').length === 1);
ok('filterByLang "all" -> all', fns.filterByLang(langs, 'all').length === 2);

// ---- groupByFolder ----
const g = fns.groupByFolder([
  fns.addSnippet({ folder: 'SQL', title: 'a', code: '' }),
  fns.addSnippet({ folder: 'SQL', title: 'b', code: '' }),
  fns.addSnippet({ folder: 'JS', title: 'c', code: '' })
]);
ok('groupByFolder groups correctly', g.SQL.length === 2 && g.JS.length === 1);

// ---- exportJSON / importJSON (round-trip + rejection) ----
const json = fns.exportJSON(data);
ok('exportJSON is valid JSON string', typeof json === 'string' && JSON.parse(json));
const back = fns.importJSON(json);
ok('importJSON round-trips length', back.length === data.length);
ok('importJSON round-trips content', back[0].title === data[0].title);
const arrBack = fns.importJSON(JSON.stringify(data));
ok('importJSON accepts bare array', arrBack.length === data.length);

let threw = false;
try { fns.importJSON('{not json'); } catch (e) { threw = true; }
ok('importJSON rejects malformed JSON', threw);

threw = false;
try { fns.importJSON('{"foo":1}'); } catch (e) { threw = true; }
ok('importJSON rejects invalid shape (object)', threw);

threw = false;
try { fns.importJSON('[1,2,3]'); } catch (e) { threw = true; }
ok('importJSON rejects non-object elements', threw);

threw = false;
try { fns.importJSON('"a string"'); } catch (e) { threw = true; }
ok('importJSON rejects non-array/non-object', threw);

// ---- escapeHtml ----
ok('escapeHtml escapes &<>"\'',
  fns.escapeHtml('<a href="x">& \'') === '&lt;a href=&quot;x&quot;&gt;&amp; &#39;');

// ---- ZERO-EXTERNAL-LINK contract ----
ok('no <script src= ...>', !/<script src/.test(html));
ok('no <link href="http ...>', !/<link href="http/.test(html));
ok('no http:// string in index.html', !/http:\/\//.test(htmlExt));
ok('no https:// string (own-domain backlink excluded)', !/https:\/\//.test(htmlExt));

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail === 0 ? 0 : 1);
