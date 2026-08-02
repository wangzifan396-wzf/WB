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
function ok(name, cond) { if (cond) { pass++; } else { fail++; console.error('  FAIL: ' + name); } }
function approx(a, b, e) { return Math.abs(a - b) <= (e || 1e-6); }

// parseColor / hex
ok('parseColor #FFFFFF', JSON.stringify(A.parseColor('#FFFFFF')) === JSON.stringify({r:255,g:255,b:255}));
ok('parseColor short #FFF', JSON.stringify(A.parseColor('#FFF')) === JSON.stringify({r:255,g:255,b:255}));
ok('parseColor rgb()', JSON.stringify(A.parseColor('rgb(10,20,30)')) === JSON.stringify({r:10,g:20,b:30}));
ok('parseColor invalid', A.parseColor('notacolor') === null);
ok('rgbToHex round', A.rgbToHex({r:0,g:128,b:255}) === '#0080ff');

// luminance / contrast
ok('lum black = 0', approx(A.relativeLuminance({r:0,g:0,b:0}), 0, 1e-9));
ok('contrast white/black = 21', approx(A.contrastRatio({r:255,g:255,b:255},{r:0,g:0,b:0}), 21, 1e-6));
ok('contrast symmetric', approx(A.contrastRatio({r:255,g:255,b:255},{r:0,g:0,b:0}), A.contrastRatio({r:0,g:0,b:0},{r:255,g:255,b:255})));

// wcag levels
const L = A.wcagLevels(21);
ok('levels 21 all pass', L.normalAA && L.normalAAA && L.largeAA && L.largeAAA && L.uiAA && L.uiAAA);
const L4 = A.wcagLevels(4.5);
ok('levels 4.5 AA normal pass', L4.normalAA && !L4.normalAAA);
const L3 = A.wcagLevels(3);
ok('levels 3 only large/UI pass', L3.largeAA && L3.uiAA && !L3.normalAA);

// hsl round trip
const hsl = A.rgbToHsl({r:94,g:106,b:210});
const back = A.hslToRgb(hsl);
ok('hsl roundtrip', approx(back.r,94,2) && approx(back.g,106,2) && approx(back.b,210,2));

// nearestPassingColor
const fixed = A.nearestPassingColor({r:120,g:120,b:120}, {r:0,g:0,b:0}, 4.5);
ok('nearestPassingColor returns hex', /^#[0-9a-f]{6}$/.test(fixed));
ok('nearestPassingColor actually passes', A.contrastRatio(A.parseColor(fixed), {r:0,g:0,b:0}) >= 4.5 - 1e-6);

// CVD
const sim = A.simulateCVD({r:255,g:0,b:0}, 'deuteranopia');
ok('cvd returns valid rgb', sim.r>=0 && sim.r<=255 && sim.g>=0 && sim.g<=255 && sim.b>=0 && sim.b<=255);
const simN = A.simulateCVD({r:255,g:0,b:0}, 'normal');
ok('cvd normal is identity-ish', simN.r===255 && simN.g===0 && simN.b===0);

// extractElements
const els = A.extractElements('<div id="a" class="x y"><img src="i.png" alt=""><input id="b"><label for="b"></label><br/></div>');
ok('extract count (no self-close double)', els.filter(function(e){return e.tag==='img';}).length === 1);
ok('extract attrs', els.filter(function(e){return e.tag==='div';})[0].attrs.id === 'a');
ok('extract class first', els.filter(function(e){return e.tag==='div';})[0].attrs.class === 'x y');

// auditHtml
const issues = A.auditHtml('<html><img src="x.png"><input id="e"><label for="e"></label><h1>t</h1><h3>s</h3><div tabindex="1"></div><a href="/y" aria-label="go"></a></html>');
const rules = issues.map(function(i){return i.rule;});
ok('audit flags img-alt', rules.indexOf('img-alt') >= 0);
ok('audit flags heading-order', rules.indexOf('heading-order') >= 0);
ok('audit flags tabindex-pos', rules.indexOf('tabindex-pos') >= 0);
ok('audit flags doc-lang (html no lang)', rules.indexOf('doc-lang') >= 0);
ok('audit no dup-id here', rules.indexOf('dup-id') < 0);
ok('audit input with label -> no input-label', rules.indexOf('input-label') < 0);

const issuesLang = A.auditHtml('<html lang="en"><img alt="x" src="a.png"><input id="e"><label for="e">E</label></html>');
const rulesLang = issuesLang.map(function(i){return i.rule;});
ok('audit html WITH lang -> no doc-lang', rulesLang.indexOf('doc-lang') < 0);
ok('audit img with alt -> no img-alt', rulesLang.indexOf('img-alt') < 0);

const issues2 = A.auditHtml('<img src="y.png"><input id="z"><h2>start</h2>');
const rules2 = issues2.map(function(i){return i.rule;});
ok('audit fragment no lang -> doc-lang', rules2.indexOf('doc-lang') >= 0);
ok('audit input no label -> input-label', rules2.indexOf('input-label') >= 0);
ok('audit heading-start h2', rules2.indexOf('heading-start') >= 0);

console.log('A11yForge _test: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
