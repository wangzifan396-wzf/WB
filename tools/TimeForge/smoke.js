// TimeForge smoke test (jsdom)
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
  t('title', /TimeForge/.test(d.title));
  t('pure exposed', typeof window.TimeForgePure === 'object');
  t('iso fn', window.TimeForgePure.isoInZone(0, 480) === '1970-01-01T08:00:00+08:00');
  t('clock running', d.getElementById('nowLine').textContent.indexOf('现在') >= 0);
  t('zone select filled', d.getElementById('dtZone').children.length === 6);
  // type a timestamp
  const input = d.getElementById('tsInput');
  input.value = '1753500000';
  input.dispatchEvent(new window.Event('input'));
  t('zones rendered', d.querySelectorAll('#tsZones .zone').length === 7);
  t('no error', d.getElementById('tsErr').textContent === '');
  // bad input
  input.value = 'hello';
  input.dispatchEvent(new window.Event('input'));
  t('error shown', d.getElementById('tsErr').textContent.length > 0);
  console.log(`\n${pass} ok, ${fail} bad`);
  process.exit(fail ? 1 : 0);
}, 300);
