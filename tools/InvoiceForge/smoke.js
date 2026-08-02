// InvoiceForge smoke test (jsdom)
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
  t('title', /InvoiceForge/.test(d.title));
  t('pure exposed', typeof window.InvoiceForgePure === 'object');
  t('cnUpper fn', window.InvoiceForgePure.cnUpper(12.3) === '壹拾贰元叁角整');
  t('sheet rendered', d.getElementById('sheet').innerHTML.length > 100);
  t('sheet cnupper', d.getElementById('sheet').innerHTML.indexOf('金额大写') >= 0);
  t('items form', d.querySelectorAll('.item-row').length === 1);
  t('add item btn', !!d.getElementById('addItem'));
  // add item via UI
  d.getElementById('addItem').click();
  t('add item via UI', d.querySelectorAll('.item-row').length === 2);
  t('print btn', !!d.getElementById('printBtn'));
  console.log(`\n${pass} ok, ${fail} bad`);
  process.exit(fail ? 1 : 0);
}, 300);
