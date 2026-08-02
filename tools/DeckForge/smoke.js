/* DeckForge jsdom smoke test — run with `node smoke.js`
 * Loads the built single-file index.html, lets the app boot, and verifies the
 * DOM renders without fatal errors. Also exercises parseSlides/renderSlide on
 * the bundled starter template.
 */
const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole } = require('C:/Users/53014/.workbuddy/binaries/node/workspace/node_modules/jsdom');

// Signal that we are running under jsdom (harmless flag, per spec).
global.JSDOM = 1;

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const errors = [];
const vc = new VirtualConsole();
vc.on('jsdomError', e => errors.push(e && e.message ? e.message : String(e)));

const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  virtualConsole: vc,
  pretendToBeVisual: true,
  url: 'https://localhost/'
});
const { window } = dom;

let done = false;
function finish(){
  if (done) return; done = true;
  const d = window.document;
  let okAll = true;

  const ids = ['md', 'slidePage', 'counter', 'exportBtn', 'prevBtn', 'nextBtn', 'thumbsBtn', 'printBtn', 'stage'];
  ids.forEach(id => {
    const el = d.getElementById(id);
    if (!el){ okAll = false; console.error('  ✗ missing #' + id); }
    else console.log('  ✓ #' + id);
  });

  // i18n nodes present
  const i18nCount = d.querySelectorAll('[data-i18n]').length;
  console.log('  ✓ data-i18n nodes: ' + i18nCount);
  if (i18nCount < 5) okAll = false;

  // counter shows a sensible value
  const counter = d.getElementById('counter');
  console.log('  ✓ counter: ' + (counter ? counter.textContent : '(none)'));

  // exercise pure functions on the bundled starter template
  const m = html.match(/<script type="text\/plain" id="starter">([\s\S]*?)<\/script>/);
  const starterMd = m ? m[1] : '';
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(s => s[1]);
  const appScript = scripts.find(s => s.includes('parseSlides') && s.includes('module.exports'));
  const sandbox = { module: { exports: {} }, console };
  // eslint-disable-next-line no-eval
  require('vm').runInNewContext(appScript, sandbox);
  const M = sandbox.module.exports;
  const slides = M.parseSlides(starterMd);
  const first = slides.length ? M.renderSlide(slides[0]) : '';
  console.log('  ✓ starter slides: ' + slides.length);
  if (slides.length < 1) okAll = false;
  if (!first || first.length < 1) okAll = false;
  console.log('  ✓ first slide rendered (' + first.length + ' chars)');

  // fatal errors only (ignore expected non-fatal jsdom quirks)
  const fatal = errors.filter(e => !/Could not load|serviceWorker|navigation|Not implemented/i.test(e));
  if (fatal.length){ okAll = false; console.error('  ✗ fatal jsdom errors: ' + fatal.join(' | ')); }
  else console.log('  ✓ no fatal jsdom errors (' + errors.length + ' total, all non-fatal)');

  console.log(okAll ? '\nSMOKE OK' : '\nSMOKE FAIL');
  process.exit(okAll ? 0 : 1);
}

setTimeout(finish, 2500);
setTimeout(() => { if (!done){ console.error('  ✗ smoke timeout'); process.exit(1); } }, 8000);
