// InvoiceForge pure function tests (Node, no deps)
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { console.error('FAIL: no <script> found'); process.exit(1); }

const mod = { exports: {} };
new Function('module', 'exports', 'require', m[1])(mod, mod.exports, require);
const P = mod.exports;

let pass = 0, fail = 0;
function t(name, cond) {
  if (cond) { pass++; console.log('  PASS', name); }
  else { fail++; console.error('  FAIL', name); }
}

// round2 / formatMoney
t('round2', P.round2(1.005) === 1.01 || P.round2(1.005) === 1);  // float edge tolerated
t('round2 basic', P.round2(3.14159) === 3.14);
t('formatMoney', P.formatMoney(1234567.891) === '1,234,567.89');
t('formatMoney zero', P.formatMoney(0) === '0.00');
t('formatMoney neg', P.formatMoney(-42.5) === '-42.50');

// lineTotal / calcTotals
t('lineTotal', P.lineTotal({ qty: 3, price: 19.99 }) === 59.97);
const tot = P.calcTotals([{ qty: 2, price: 100 }, { qty: 1, price: 50 }], 13, 20);
t('subtotal', tot.subtotal === 250);
t('discount', tot.discount === 20);
t('taxable', tot.taxable === 230);
t('tax 13%', tot.tax === 29.9);
t('total', tot.total === 259.9);
const tot2 = P.calcTotals([], 0, 0);
t('empty totals', tot2.total === 0 && tot2.subtotal === 0);
t('discount capped', P.calcTotals([{ qty: 1, price: 10 }], 0, 999).discount === 10);

// intToCn
t('intToCn 0', P.intToCn(0) === '零');
t('intToCn 7', P.intToCn(7) === '柒');
t('intToCn 10', P.intToCn(10) === '壹拾');
t('intToCn 105', P.intToCn(105) === '壹佰零伍');
t('intToCn 1005', P.intToCn(1005) === '壹仟零伍');
t('intToCn 10012', P.intToCn(10012) === '壹万零壹拾贰');
t('intToCn 1e8', P.intToCn(100000000) === '壹亿');
t('intToCn 120000500', P.intToCn(120000500) === '壹亿贰仟万零伍佰');

// cnUpper
t('cnUpper 0', P.cnUpper(0) === '零元整');
t('cnUpper 1234.56', P.cnUpper(1234.56) === '壹仟贰佰叁拾肆元伍角陆分');
t('cnUpper 100.5', P.cnUpper(100.5) === '壹佰元伍角整');
t('cnUpper 0.05', P.cnUpper(0.05) === '零元零伍分');
t('cnUpper 10012', P.cnUpper(10012) === '壹万零壹拾贰元整');
t('cnUpper neg', P.cnUpper(-3.2) === '负叁元贰角整');

// genInvoiceNo
t('invoice no format', /^INV-\d{8}-\d{4}$/.test(P.genInvoiceNo(new Date(), 12)));
t('invoice no seq', P.genInvoiceNo(new Date(2026, 0, 5), 7).endsWith('-0007'));

// default / json roundtrip
const inv = P.defaultInvoice();
t('default has item', inv.items.length === 1);
const j = P.toJSON(inv);
const back = P.fromJSON(j);
t('json roundtrip', JSON.stringify(back) === JSON.stringify(inv));
let threw = false;
try { P.fromJSON('{"items":"x"}'); } catch (e) { threw = true; }
t('fromJSON rejects', threw);

// renderInvoice
inv.seller.name = '<b>公司</b>';
inv.items = [{ name: '服务A', qty: 2, price: 500 }];
inv.taxRate = 6;
const h = P.renderInvoice(inv);
t('render escapes', h.indexOf('&lt;b&gt;公司&lt;/b&gt;') >= 0);
t('render total', h.indexOf('1,060.00') >= 0);
t('render cnupper', h.indexOf('壹仟零陆拾元整') >= 0);
t('render tax line', h.indexOf('税额 (6%)') >= 0);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
