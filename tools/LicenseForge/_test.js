/* Node test: extract first <script> from index.html, run pure fns, assert. */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { console.error('NO SCRIPT FOUND'); process.exit(1); }
const fn = new Function('module', 'exports', 'require', m[1]);
fn(module, module.exports, require);
const A = module.exports;

let pass = 0, fail = 0;
function ok(name, cond){ if (cond) pass++; else { fail++; console.error('  FAIL: ' + name); } }

ok('ids has 5', A.ids().length === 5);
ok('MIT render', (() => { var t=A.render('MIT',{year:2026,name:'Wang'}); return /MIT License/.test(t) && /2026/.test(t) && /Wang/.test(t); })());
ok('BSD render', /BSD 3-Clause License/.test(A.render('BSD-3-Clause',{year:2026,name:'X'})));
ok('ISC render', /ISC License/.test(A.render('ISC',{year:2026,name:'X'})));
ok('Apache render', (() => { var t=A.render('Apache-2.0',{year:2026,name:'Wang'}); return /Apache License/.test(t) && /Version 2\.0/.test(t) && /Wang/.test(t); })());
ok('Unlicense no subst', /public domain/.test(A.render('Unlicense',{year:2026,name:'X'})));
ok('unknown id null', A.render('GPL-3.0',{year:2026,name:'X'}) === null);
ok('fill empty name -> blank', A.fill('year={year} name={name}',{year:'Y'}) === 'year=Y name=');

console.log('LicenseForge _test: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
