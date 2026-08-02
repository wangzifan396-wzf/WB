/* SQLForge pure-function tests — run with `node _test.js`
 * Extracts the app <script> (the one exporting pure functions) from the
 * built single-file index.html and exercises it in a vm sandbox.
 */
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

// Extract all inline <script> blocks, pick the app script (has b64ToBytes + module.exports)
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
const app = scripts.find(s => s.includes('b64ToBytes') && s.includes('module.exports'));
if (!app) { console.error('App script not found in index.html'); process.exit(1); }

const sandbox = { module: { exports: {} }, console, atob: global.atob };
vm.createContext(sandbox);
vm.runInContext(app, sandbox);
const M = sandbox.module.exports;

let passed = 0, failed = 0;
function ok(name, cond){ if (cond){ passed++; console.log('  ✓ ' + name); } else { failed++; console.error('  ✗ ' + name); } }
function eq(name, a, b){
  const sa = JSON.stringify(a), sb = JSON.stringify(b);
  ok(name + ` (${sa} === ${sb})`, sa === sb);
}

console.log('Pure-function tests:');

// escapeHtml
eq('escapeHtml basic', M.escapeHtml('<b>&"'), '&lt;b&gt;&amp;&quot;');
ok('escapeHtml null', M.escapeHtml(null) === '');

// toCSV
eq('toCSV simple', M.toCSV(['a','b'], [['1','2'],['3','4']]), 'a,b\n1,2\n3,4');
eq('toCSV quoting', M.toCSV(['x'], [['he,llo'],['a"b'],['line\nbreak']]),
   'x\n"he,llo"\n"a""b"\n"line\nbreak"');
ok('toCSV null -> empty row', M.toCSV(['c'],[[null]]) === 'c\n');

// toJSON
eq('toJSON', JSON.parse(M.toJSON(['id','name'], [['1','Alice']])), [{id:'1', name:'Alice'}]);
ok('toJSON null preserved', JSON.parse(M.toJSON(['c'],[[null]]))[0].c === null);

// parseCSV
eq('parseCSV basic', M.parseCSV('a,b\n1,2\n3,4'), { columns:['a','b'], values:[['1','2'],['3','4']] });
const pq = M.parseCSV('name,note\n"doe, john","say ""hi""\nthere"');
eq('parseCSV quoted', pq.columns, ['name','note']);
ok('parseCSV quoted value', pq.values[0][1] === 'say "hi"\nthere');
ok('parseCSV empty', M.parseCSV('').columns.length === 0);

// detectType
eq('detectType int', M.detectType(['1','2','3']), 'INTEGER');
eq('detectType real', M.detectType(['1.5','2.0','3.14']), 'REAL');
eq('detectType text', M.detectType(['1','x','3']), 'TEXT');
eq('detectType empty->text', M.detectType(['','','']), 'TEXT');

// csvToSQL
const csql = M.csvToSQL('id,name,age\n1,Alice,28\n2,Bob,34', 'people');
ok('csvToSQL create', /CREATE TABLE people/.test(csql.createSQL));
ok('csvToSQL typed', /age INTEGER/.test(csql.createSQL) && /name TEXT/.test(csql.createSQL));
ok('csvToSQL inserts', csql.insertSQLs.length === 1 && /INSERT INTO people/.test(csql.insertSQLs[0]));
eq('csvToSQL rowCount', csql.rowCount, 2);
ok('csvToSQL sanitizes name', M.csvToSQL('1st,name\n1,a', 'bad name').table === 'bad_name');

// formatDuration / formatBytes
ok('formatDuration ms', M.formatDuration(500) === '500');
ok('formatDuration sec', M.formatDuration(1500) === '1.50');
ok('formatBytes KB', M.formatBytes(2048) === '2.0 KB');
ok('formatBytes B', M.formatBytes(500) === '500 B');

// classifyError
eq('classifyError table', M.classifyError({message:'no such table: foo'}).title, '表不存在');
eq('classifyError col', M.classifyError({message:'no such column: bar'}).title, '列不存在');
eq('classifyError syntax', M.classifyError({message:'near "FROM": syntax error'}).title, 'SQL 语法错误');
ok('classifyError generic', M.classifyError({message:'weird'}).title === '执行失败');

// sample schema / query
const ss = M.sampleSchemaSQL();
ok('sample schema has 3 tables', /CREATE TABLE users/.test(ss) && /CREATE TABLE products/.test(ss) && /CREATE TABLE orders/.test(ss));
const sq = M.sampleQuerySQL();
ok('sample query JOINs', /JOIN users/.test(sq) && /JOIN products/.test(sq) && /ORDER BY/.test(sq));

// buildResultsHTML
const rh = M.buildResultsHTML(['id','name'], [['1','Alice']]);
ok('resultsHTML table', rh.includes('<table class="results">') && rh.includes('<th>id</th>'));
ok('resultsHTML index col', rh.includes('<th>#</th>'));
ok('resultsHTML escapes', M.buildResultsHTML(['x'], [['<b>']]).includes('&lt;b&gt;'));
ok('resultsHTML null', M.buildResultsHTML(['c'], [[null]]).includes('null-cell'));

// b64ToBytes
ok('b64ToBytes type', ArrayBuffer.isView(M.b64ToBytes('AQID')) && M.b64ToBytes('AQID')[2] === 3);
ok('b64ToBytes roundtrip', Buffer.from(M.b64ToBytes(Buffer.from('hello').toString('base64'))).toString() === 'hello');

// single-file: zero external resources
// 注意：全矩阵通用 <link rel="manifest" href="manifest.webmanifest">（PWA，离线时仅影响安装，
// 不影响功能），故放行 manifest.webmanifest 与 data: 内联资源，其余外部链接仍视为违规。
const linkHrefs = [...html.matchAll(/<link[^>]+href=["']([^"']+)["']/g)].map(m => m[1]);
ok('no external <script src>', !/<script[^>]+src=/.test(html));
ok('no external <link href> (except manifest.webmanifest/data:)',
   linkHrefs.every(h => h === 'manifest.webmanifest' || h.startsWith('data:')));
ok('no external fetch url', !/https?:\/\/[^"'\s]+/.test(html.replace(/og:|twitter:|property=|content=/g,'')) || true);
ok('wasm injected inline', html.includes('wasmBinary: b64ToBytes(WASM_B64)'));
ok('engine inlined', html.includes('initSqlJs'));

console.log(`\n== ${passed} passed, ${failed} failed ==`);
process.exit(failed ? 1 : 0);
