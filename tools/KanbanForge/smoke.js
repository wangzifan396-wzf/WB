// KanbanForge smoke test (jsdom)
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true });
const { window } = dom;

let pass = 0, fail = 0;
function t(name, cond) {
  if (cond) { pass++; console.log('  OK ', name); }
  else { fail++; console.error('  BAD', name); }
}

setTimeout(() => {
  const d = window.document;
  t('title', /KanbanForge/.test(d.title));
  t('pure exposed', typeof window.KanbanForgePure === 'object');
  t('pure fn', typeof window.KanbanForgePure.moveCard === 'function');
  t('board rendered', d.querySelectorAll('.col').length === 3);
  t('cards rendered', d.querySelectorAll('.card').length === 3);
  t('add col btn', !!d.getElementById('addColBtn'));
  t('stats rendered', d.getElementById('stats').textContent.indexOf('3') >= 0);
  t('modal hidden', !d.getElementById('overlay').classList.contains('show'));
  // add a column via UI
  d.getElementById('addColBtn').click();
  t('add column via UI', d.querySelectorAll('.col').length === 4);
  console.log(`\n${pass} ok, ${fail} bad`);
  process.exit(fail ? 1 : 0);
}, 300);
