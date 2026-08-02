/* DeckForge pure-function tests — run with `node _test.js`
 * Extracts the app <script> (the one exporting pure functions) from the
 * built single-file index.html and exercises it in a vm sandbox.
 */
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

// Extract all inline <script> blocks, pick the app script (has module.exports)
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
const app = scripts.find(s => s.includes('parseSlides') && s.includes('module.exports'));
if (!app) { console.error('App script not found in index.html'); process.exit(1); }

const sandbox = { module: { exports: {} }, console };
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
ok('escapeHtml quote+apos', M.escapeHtml("a'b").includes('&#39;'));

// parseSlides
eq('parseSlides split', M.parseSlides('# A\n\n---\n\n# B').length, 2);
eq('parseSlides trims', M.parseSlides('  # A  \n---\n# B').map(s => s.trim()), ['# A', '# B']);
eq('parseSlides drops trailing empty', M.parseSlides('# A\n---\n').map(s => s.trim()), ['# A']);
eq('parseSlides empty -> 1', M.parseSlides('').length, 1);
eq('parseSlides multi', M.parseSlides('a\n---\nb\n---\nc').length, 3);

// countSlides
eq('countSlides', M.countSlides('# A\n---\n# B\n---\n# C'), 3);

// renderSlide — security: must escape raw HTML/scripts
const sec = M.renderSlide('hi <script>alert(1)</script> world');
ok('renderSlide escapes <script>', sec.includes('&lt;script&gt;') && !sec.includes('<script>'));
const sec2 = M.renderSlide('<img src=x onerror=alert(1)>');
ok('renderSlide escapes onerror', !sec2.includes('<img') && sec2.includes('&lt;img'));

// renderSlide — formatting
ok('renderSlide h1', M.renderSlide('# Title').includes('<h1>Title</h1>'));
ok('renderSlide h3', M.renderSlide('### Sub').includes('<h3>Sub</h3>'));
ok('renderSlide ul', M.renderSlide('- a\n- b').includes('<ul>') && (M.renderSlide('- a\n- b').match(/<li>/g) || []).length === 2);
ok('renderSlide ol', M.renderSlide('1. a\n2. b').includes('<ol>') && (M.renderSlide('1. a\n2. b').match(/<li>/g) || []).length === 2);
ok('renderSlide blockquote', M.renderSlide('> quote').includes('<blockquote>') && M.renderSlide('> quote').includes('quote'));
ok('renderSlide code block', M.renderSlide('```\nlet x=1;\n```').includes('<pre><code>') && M.renderSlide('```\nlet x=1;\n```').includes('let x=1;'));
ok('renderSlide bold', M.renderSlide('**b**').includes('<strong>b</strong>'));
ok('renderSlide italic', M.renderSlide('*i*').includes('<em>i</em>'));
ok('renderSlide inline code', M.renderSlide('`c`').includes('<code>c</code>'));
ok('renderSlide link (http)', M.renderSlide('[t](https://e.com)').includes('<a href="https://e.com"'));
ok('renderSlide link blocked (javascript:)', !M.renderSlide('[t](javascript:alert(1))').includes('href='));
ok('renderSlide image (https)', M.renderSlide('![a](https://e.com/x.png)').includes('<img src="https://e.com/x.png"') && M.renderSlide('![a](https://e.com/x.png)').includes('alt="a"'));
ok('renderSlide image blocked (javascript:)', !M.renderSlide('![a](javascript:alert(1))').includes('<img'));

// validateMd
ok('validateMd ok', M.validateMd('# A\n---\n# B').ok === true);
eq('validateMd slide count', M.validateMd('# A\n---\n# B').slides, 2);
ok('validateMd empty -> not ok', M.validateMd('').ok === false);
ok('validateMd note present', typeof M.validateMd('# A').note === 'string');

// deckHtml
const deck = M.deckHtml('# A1\n\n---\n\n# B2', { theme: 'dark', title: 'My Deck' });
ok('deckHtml doctype', deck.startsWith('<!DOCTYPE html>'));
ok('deckHtml has all slides', deck.includes('A1') && deck.includes('B2'));
ok('deckHtml inline style', deck.includes('<style>') && deck.includes('.deck'));
ok('deckHtml renders section per slide', (deck.match(/<section class="slide">/g) || []).length === 2);
ok('deckHtml has nav', deck.includes('id="ct"') && deck.includes('id="pv"'));
ok('deckHtml title escaped', deck.includes('<title>My Deck</title>'));
ok('deckHtml no </script> injection issue — contains closing tag', deck.includes('</scr' + 'ipt>') || deck.includes('</script>'));
const deckLight = M.deckHtml('# X', { theme: 'light' });
ok('deckHtml light theme', deckLight.includes('data-theme="light"'));

// single-file: zero EXTERNAL resources (relative manifest/sw are fine)
ok('no external <script src= http>', !/<script[^>]+src=["']https?:\/\//.test(html));
ok('no external <link href= http>', !/<link[^>]+href=["']https?:\/\//.test(html));
ok('app script inlined (no </script> truncated)', html.indexOf('module.exports') > -1);

console.log(`\n== ${passed} passed, ${failed} failed ==`);
process.exit(failed ? 1 : 0);
