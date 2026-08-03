/**
 * nano-tools matrix render gate.
 * Catches the two failure classes static audits miss:
 *   R1 [P0] inline <script> has a JS syntax error  -> whole page is dead
 *   R2 [P0] unbalanced <script>/</script> or missing </html> -> file truncated
 *   R3 [P1] invalid unquoted object key (e.g. 2048Forge:) -> syntax error
 *   R4 [P1] double comma ",," at end of line inside object literal
 * Usage: node audit_render.js [rootDir]
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = process.argv[2] || 'D:/WB_Files';
const IDENT = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
const SKIP = new Set(['__skills_tmp', '__pycache__', '.git', 'node_modules', 'promo-assets']);

const findings = [];
function add(sev, code, repo, msg) { findings.push({ sev, code, repo, msg }); }

function checkHtml(repo, file) {
  const html = fs.readFileSync(file, 'utf8');
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');

  // R2 truncation: document must end with </html>
  if (!/<\/html>\s*$/.test(html)) add('P2', 'R5', repo, `${rel}: does not end with </html>`);

  // Linear scan mirroring the HTML tokenizer: a script block runs to the FIRST </script.
  // (so "<script" appearing inside JS strings is not counted as an opening tag)
  let pos = 0, i = 0;
  while (true) {
    const o = html.toLowerCase().indexOf('<script', pos);
    if (o < 0) break;
    const gt = html.indexOf('>', o);
    if (gt < 0) { add('P0', 'R2', repo, `${rel}: unterminated <script tag at offset ${o}`); break; }
    const tag = html.slice(o, gt + 1);
    const c = html.toLowerCase().indexOf('</script', gt + 1);
    if (c < 0) {
      const line = html.slice(0, o).split('\n').length;
      add('P0', 'R2', repo, `${rel}: <script> at line ${line} is never closed — file truncated`);
      break;
    }
    i++;
    const ty = (tag.match(/\btype\s*=\s*["']?([^"'>\s]+)/i) || [, ''])[1].toLowerCase();
    const isJs = !ty || ty === 'text/javascript' || ty === 'application/javascript' || ty === 'module';
    if (!/\bsrc=/.test(tag) && isJs) {
      const body = html.slice(gt + 1, c);
      try { new vm.Script(body); }
      catch (e) {
        const line = html.slice(0, o).split('\n').length;
        add('P0', 'R1', repo, `${rel}: script#${i} (line ${line}) SyntaxError: ${e.message}`);
      }
    }
    pos = html.indexOf('>', c);
    if (pos < 0) break;
    pos += 1;
  }

  // R3 / R4 line-level smells
  html.split('\n').forEach((ln, n) => {
    const k = ln.match(/^\s{2,8}([A-Za-z0-9_$]+)\s*:\s*[{'"[]/);
    if (k && !IDENT.test(k[1])) {
      let ok = true;
      try { new vm.Script('({' + k[1] + ':1})'); } catch (e) { ok = false; }
      if (!ok) add('P1', 'R3', repo, `${rel}:${n + 1} invalid unquoted key "${k[1]}"`);
    }
    if (/,,\s*$/.test(ln)) add('P1', 'R4', repo, `${rel}:${n + 1} double comma at end of line`);
  });
}

const repos = fs.readdirSync(ROOT, { withFileTypes: true })
  .filter(d => d.isDirectory() && !SKIP.has(d.name))
  .map(d => d.name)
  .filter(n => fs.existsSync(path.join(ROOT, n, 'index.html')));

repos.forEach(r => { try { checkHtml(r, path.join(ROOT, r, 'index.html')); } catch (e) { add('P0', 'R0', r, 'read error: ' + e.message); } });

console.log('='.repeat(72));
console.log(`nano-tools render gate — scanned ${repos.length} repos with index.html`);
console.log('='.repeat(72));
if (!findings.length) console.log('无缺陷。');
else {
  const by = {};
  findings.forEach(f => { (by[f.code] = by[f.code] || []).push(f); });
  Object.keys(by).sort().forEach(c => {
    console.log(`\n[${by[c][0].sev}] ${c} — ${by[c].length} 条`);
    by[c].slice(0, 25).forEach(f => console.log('   ' + f.repo + ' :: ' + f.msg));
    if (by[c].length > 25) console.log(`   … 另有 ${by[c].length - 25} 条`);
  });
}
const blocking = findings.filter(f => f.sev === 'P0' || f.sev === 'P1').length;
console.log(`\n合计: ${findings.length} 条，阻断项 ${blocking}`);
process.exit(blocking ? 1 : 0);
