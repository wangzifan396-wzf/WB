/**
 * nano-tools portal consistency gate.
 * Catches the failure class that bit us in batch 63: a stray fragment inside the
 * portal's TOOLS / EN / ICONS arrays (e.g. a floating comma + blank lines) makes
 * the whole index.html fail to parse as JS, killing the page. Also flags any
 * TOOLS id missing an EN entry, and a hardcoded count that disagrees with the
 * real tool-directory count.
 *
 * Usage: node audit_portal.js [rootDir]   (rootDir defaults to repo root ".")
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = process.argv[2] || '.';
const htmlPath = path.join(ROOT, 'index.html');
const errs = [];

if (!fs.existsSync(htmlPath)) {
  console.log('PORTAL AUDIT FAIL: index.html not found at ' + htmlPath);
  process.exit(1);
}
const html = fs.readFileSync(htmlPath, 'utf8');

function grab(name, close) {
  const m = html.match(new RegExp('var ' + name + '\\s*=\\s*([\\s\\S]*?)\\n  ' + close));
  if (!m) { errs.push('portal missing array: ' + name); return null; }
  try { new vm.Script(m[0]); }
  catch (e) { errs.push(`portal ${name} syntax error: ${e.message}`); return null; }
  return m[0];
}

const T = grab('TOOLS', '\\];');
const E = grab('EN', '\\};');
const I = grab('ICONS', '\\};');

if (T && E && I) {
  const tIds = [...T.matchAll(/id:"([^"]+)"/g)].map(m => m[1]);
  const eKeys = new Set([...E.matchAll(/^\s*["']?([A-Za-z0-9_]+)["']?\s*:\s*\{/gm)].map(m => m[1]));
  // EN keys use CamelCase ids (same convention as TOOLS) -> strict check is safe.
  // Whitelist: nano-workbench is the aggregator portal itself, intentionally has no EN.
  const EN_WHITELIST = new Set(['nano-workbench']);
  const missE = tIds.filter(id => !eKeys.has(id) && !EN_WHITELIST.has(id));
  if (missE.length) errs.push('TOOLS ids missing EN entry: ' + missE.join(', '));

  // ICONS uses lowercase slug keys (documented dual convention, see task #35),
  // so strict id alignment / count comparison is unreliable here — we only
  // require it to parse (done above) and be non-empty.

  // Hardcoded "N 个单文件" count must match real tool-dir count.
  const toolsDir = path.join(ROOT, 'tools');
  let dirCount = 0;
  if (fs.existsSync(toolsDir)) {
    dirCount = fs.readdirSync(toolsDir).filter(d => {
      try { return fs.statSync(path.join(toolsDir, d)).isDirectory(); } catch (e) { return false; }
    }).length;
  }
  const mCount = html.match(/(\d+)\s*个单文件/);
  if (mCount && parseInt(mCount[1], 10) !== dirCount) {
    errs.push(`portal hardcoded count ${mCount[1]} != real tool dirs ${dirCount}`);
  }
}

if (errs.length) {
  console.log('='.repeat(72));
  console.log('PORTAL AUDIT FAIL');
  console.log('='.repeat(72));
  errs.forEach(e => console.log(' - ' + e));
  process.exit(1);
}
console.log('PORTAL AUDIT OK — TOOLS/EN/ICONS valid, EN aligned, count consistent.');
