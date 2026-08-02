/* CodeForge unit tests — run: node _test.js */
'use strict';
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { console.error('FATAL: no script block found'); process.exit(1); }

const mod = { exports: {} };
new Function('module', 'exports', 'require', m[1])(mod, mod.exports, require);
const CF = mod.exports;

let pass = 0, fail = 0;
function ok(cond, name) {
  if (cond) { pass++; console.log('  ok  ' + name); }
  else { fail++; console.error('FAIL  ' + name); }
}
function eq(a, b, name) { ok(a === b, name + ' (got ' + JSON.stringify(a) + ')'); }

/* ---- escapeHtml ---- */
eq(CF.cfEscapeHtml('<a href="x">&\'</a>'), '&lt;a href=&quot;x&quot;&gt;&amp;&#39;&lt;/a&gt;', 'escapeHtml escapes all 5 chars');
eq(CF.cfEscapeHtml(null), '', 'escapeHtml(null) = empty');
eq(CF.cfEscapeHtml(123), '123', 'escapeHtml coerces numbers');

/* ---- buildDoc ---- */
const doc = CF.cfBuildDoc('<h1>Hi</h1>', 'h1{color:red}', 'console.log(1)');
ok(doc.startsWith('<!DOCTYPE html>'), 'buildDoc starts with doctype');
ok(doc.indexOf('<h1>Hi</h1>') > -1, 'buildDoc contains html pane');
ok(doc.indexOf('h1{color:red}') > -1, 'buildDoc contains css pane');
ok(doc.indexOf('console.log(1)') > -1, 'buildDoc contains js pane');
ok(doc.indexOf('postMessage') > -1, 'buildDoc injects console bridge');
ok(doc.indexOf(CF.CF_BRIDGE_KEY) > -1, 'buildDoc bridge uses key');
ok(doc.indexOf('try{') > -1 && doc.indexOf('}catch(e){') > -1, 'buildDoc wraps js in try/catch');
const docEmpty = CF.cfBuildDoc(null, undefined, null);
ok(docEmpty.indexOf('<style></style>') > -1 && docEmpty.indexOf('<body><script>try{') > -1, 'buildDoc tolerates null/undefined');

/* ---- exportDoc ---- */
const ex = CF.cfExportDoc('<p>x</p>', 'p{...}', 'alert(1)', 'my<proj>');
ok(ex.indexOf('postMessage') === -1, 'exportDoc has no bridge');
ok(ex.indexOf('my&lt;proj&gt;') > -1, 'exportDoc escapes title');
ok(ex.indexOf('<p>x</p>') > -1 && ex.indexOf('alert(1)') > -1, 'exportDoc embeds panes');

/* ---- serialize / parse round-trip ---- */
const p1 = { name: 'demo', html: '<b>a</b>', css: 'b{}', js: 'x=1', savedAt: '2026-07-27' };
const rt = CF.cfParseProject(CF.cfSerializeProject(p1));
ok(rt && rt.name === 'demo' && rt.html === '<b>a</b>' && rt.css === 'b{}' && rt.js === 'x=1', 'serialize/parse round-trip');
eq(CF.cfParseProject('not json'), null, 'parse invalid json = null');
eq(CF.cfParseProject('{"app":"Other"}'), null, 'parse foreign app = null');
eq(CF.cfParseProject('42'), null, 'parse non-object = null');
ok(CF.cfParseProject(CF.cfSerializeProject({})).name === 'untitled', 'serialize empty defaults name');

/* ---- exportFilename ---- */
eq(CF.cfExportFilename('My Cool Project!'), 'My-Cool-Project.html', 'filename sanitizes spaces/punct');
eq(CF.cfExportFilename('///'), 'codeforge-export.html', 'filename fallback on empty');
eq(CF.cfExportFilename('a', 'json'), 'a.json', 'filename custom ext');

/* ---- byteSize / formatBytes / lineCount ---- */
eq(CF.cfByteSize('abc'), 3, 'byteSize ascii');
eq(CF.cfByteSize('中'), 3, 'byteSize CJK = 3 bytes');
eq(CF.cfByteSize('😀'), 4, 'byteSize emoji surrogate pair = 4');
eq(CF.cfFormatBytes(512), '512 B', 'formatBytes B');
eq(CF.cfFormatBytes(2048), '2.0 KB', 'formatBytes KB');
eq(CF.cfLineCount('a\nb\nc'), 3, 'lineCount 3 lines');
eq(CF.cfLineCount(''), 1, 'lineCount empty = 1');

/* ---- console helpers ---- */
eq(CF.cfFormatConsoleLine(['a', 'b', '1']), 'a b 1', 'formatConsoleLine joins');
ok(CF.cfIsBridgeMessage({ [CF.CF_BRIDGE_KEY]: 1, type: 'log', args: [] }), 'isBridgeMessage accepts valid');
ok(!CF.cfIsBridgeMessage({ type: 'log', args: [] }), 'isBridgeMessage rejects missing key');
ok(!CF.cfIsBridgeMessage(null), 'isBridgeMessage rejects null');

/* ---- indent ---- */
const ind = CF.cfIndentAt('ab', 1, 1);
ok(ind.value === 'a  b' && ind.selStart === 3, 'indentAt inserts 2 spaces at cursor');
const ind2 = CF.cfIndentAt('abcd', 1, 3);
eq(ind2.value, 'a  d', 'indentAt replaces selection');

/* ---- starter ---- */
const st = CF.cfStarterProject();
ok(st.name === 'hello-forge' && st.html.length > 0 && st.css.length > 0 && st.js.length > 0, 'starter project complete');

console.log('\nCodeForge: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
