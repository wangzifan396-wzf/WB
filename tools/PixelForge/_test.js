/* PixelForge unit tests — run: node _test.js */
'use strict';
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { console.error('FATAL: no script block found'); process.exit(1); }

const mod = { exports: {} };
new Function('module', 'exports', 'require', m[1])(mod, mod.exports, require);
const PF = mod.exports;

let pass = 0, fail = 0;
function ok(cond, name) {
  if (cond) { pass++; console.log('  ok  ' + name); }
  else { fail++; console.error('FAIL  ' + name); }
}
function eq(a, b, name) { ok(a === b, name + ' (got ' + JSON.stringify(a) + ')'); }

/* ---- grid basics ---- */
const g = PF.pfCreateGrid(4, 3);
eq(g.length, 12, 'createGrid 4x3 length 12');
ok(g.every(c => c === null), 'createGrid all null');
eq(PF.pfCreateGrid(0, 5).length, 0, 'createGrid 0 width = empty');
eq(PF.pfIdx(2, 1, 4), 6, 'idx(2,1,w4) = 6');
ok(PF.pfInBounds(0, 0, 4, 3) && PF.pfInBounds(3, 2, 4, 3), 'inBounds corners');
ok(!PF.pfInBounds(-1, 0, 4, 3) && !PF.pfInBounds(4, 0, 4, 3) && !PF.pfInBounds(0, 3, 4, 3), 'inBounds rejects out');

/* ---- setPixel / getPixel ---- */
ok(PF.pfSetPixel(g, 4, 3, 1, 1, '#FF0000'), 'setPixel returns true on change');
eq(PF.pfGetPixel(g, 4, 3, 1, 1), '#FF0000', 'getPixel reads back');
ok(!PF.pfSetPixel(g, 4, 3, 1, 1, '#FF0000'), 'setPixel same color = false');
ok(!PF.pfSetPixel(g, 4, 3, 9, 9, '#FF0000'), 'setPixel out of bounds = false');
eq(PF.pfGetPixel(g, 4, 3, 9, 9), undefined, 'getPixel out of bounds = undefined');

/* ---- clone ---- */
const g2 = PF.pfClone(g);
ok(g2 !== g && g2[PF.pfIdx(1, 1, 4)] === '#FF0000', 'clone is deep-equal copy, new ref');
PF.pfSetPixel(g2, 4, 3, 0, 0, '#00FF00');
eq(PF.pfGetPixel(g, 4, 3, 0, 0), null, 'clone mutation does not leak');

/* ---- flood fill ---- */
const f = PF.pfCreateGrid(4, 4);
eq(PF.pfFloodFill(f, 4, 4, 0, 0, '#111111'), 16, 'flood fill empty 4x4 fills 16');
ok(f.every(c => c === '#111111'), 'flood fill covers all');
eq(PF.pfFloodFill(f, 4, 4, 0, 0, '#111111'), 0, 'flood fill same color = 0');
// wall split
const f2 = PF.pfCreateGrid(3, 3);
[0, 1, 2].forEach(x => PF.pfSetPixel(f2, 3, 3, x, 1, '#WALL'.slice(0, 4) + '000'));
eq(PF.pfFloodFill(f2, 3, 3, 0, 0, '#222222'), 3, 'flood fill stops at wall (top row 3)');
eq(PF.pfGetPixel(f2, 3, 3, 0, 2), null, 'bottom region untouched');
eq(PF.pfFloodFill(f2, 3, 3, -1, 0, '#333333'), 0, 'flood fill out of bounds = 0');

/* ---- line (Bresenham) ---- */
const l1 = PF.pfLine(0, 0, 3, 0);
eq(l1.length, 4, 'horizontal line 4 pts');
eq(JSON.stringify(l1[3]), '[3,0]', 'line endpoint included');
const l2 = PF.pfLine(0, 0, 3, 3);
eq(l2.length, 4, 'diagonal line 4 pts');
ok(l2.every((p, i) => p[0] === i && p[1] === i), 'diagonal exact');
eq(PF.pfLine(2, 2, 2, 2).length, 1, 'degenerate line = 1 pt');
const l3 = PF.pfLine(3, 1, 0, 1);
eq(JSON.stringify(l3[0]), '[3,1]', 'reverse line starts at origin arg');

/* ---- rect ---- */
const r1 = PF.pfRect(0, 0, 3, 2);
eq(r1.length, 10, 'rect 4x3 outline = 10 pts');
const r2 = PF.pfRect(3, 2, 0, 0);
eq(r2.length, 10, 'rect normalizes corners');
eq(PF.pfRect(1, 1, 1, 1).length, 1, 'rect degenerate = 1 pt');
eq(PF.pfRect(0, 0, 2, 0).length, 3, 'rect flat 1xN dedup');

/* ---- mirror ---- */
const mgr = PF.pfCreateGrid(3, 1);
PF.pfSetPixel(mgr, 3, 1, 0, 0, '#AAA');
const mm = PF.pfMirrorH(mgr, 3, 1);
eq(PF.pfGetPixel(mm, 3, 1, 2, 0), '#AAA', 'mirrorH moves left to right');
eq(PF.pfGetPixel(mm, 3, 1, 0, 0), null, 'mirrorH clears origin side');
eq(PF.pfMirrorX(0, 16), 15, 'mirrorX 0 -> 15');
eq(PF.pfMirrorX(15, 16), 0, 'mirrorX 15 -> 0');

/* ---- resize ---- */
const rg = PF.pfCreateGrid(2, 2);
PF.pfSetPixel(rg, 2, 2, 1, 1, '#BBB');
const bigger = PF.pfResizeGrid(rg, 2, 2, 4, 4);
eq(bigger.length, 16, 'resize up length');
eq(PF.pfGetPixel(bigger, 4, 4, 1, 1), '#BBB', 'resize preserves content');
const smaller = PF.pfResizeGrid(bigger, 4, 4, 1, 1);
eq(smaller.length, 1, 'resize down length');
eq(smaller[0], null, 'resize down crops (1,1) away');

/* ---- shift ---- */
const sg = PF.pfCreateGrid(3, 3);
PF.pfSetPixel(sg, 3, 3, 1, 1, '#CCC');
const sh = PF.pfShiftGrid(sg, 3, 3, 1, 0);
eq(PF.pfGetPixel(sh, 3, 3, 2, 1), '#CCC', 'shift right moves pixel');
eq(PF.pfGetPixel(sh, 3, 3, 1, 1), null, 'shift clears source');
const sh2 = PF.pfShiftGrid(sg, 3, 3, -2, 0);
eq(PF.pfCountPixels(sh2), 0, 'shift off-grid drops pixel');

/* ---- countPixels ---- */
eq(PF.pfCountPixels(sg), 1, 'countPixels = 1');
eq(PF.pfCountPixels(PF.pfCreateGrid(5, 5)), 0, 'countPixels empty = 0');

/* ---- hex conversions ---- */
eq(JSON.stringify(PF.pfHexToRgb('#FF8000')), '[255,128,0]', 'hexToRgb 6-digit');
eq(JSON.stringify(PF.pfHexToRgb('#f00')), '[255,0,0]', 'hexToRgb 3-digit');
eq(PF.pfHexToRgb('red'), null, 'hexToRgb invalid = null');
eq(PF.pfHexToRgb(null), null, 'hexToRgb null = null');
eq(PF.pfRgbToHex(255, 128, 0), '#FF8000', 'rgbToHex');
eq(PF.pfRgbToHex(-5, 300, 7), '#00FF07', 'rgbToHex clamps');

/* ---- sheet layout ---- */
eq(JSON.stringify(PF.pfSheetLayout(1)), '{"cols":1,"rows":1}', 'layout 1');
eq(JSON.stringify(PF.pfSheetLayout(4)), '{"cols":2,"rows":2}', 'layout 4 = 2x2');
eq(JSON.stringify(PF.pfSheetLayout(5)), '{"cols":3,"rows":2}', 'layout 5 = 3x2');
eq(JSON.stringify(PF.pfSheetLayout(0)), '{"cols":1,"rows":1}', 'layout 0 -> min 1');

/* ---- scale size ---- */
eq(JSON.stringify(PF.pfScaleSize(16, 16, 8)), '{"w":128,"h":128}', 'scaleSize 8x');
eq(JSON.stringify(PF.pfScaleSize(16, 16, 0)), '{"w":16,"h":16}', 'scaleSize min 1');

/* ---- serialize / parse ---- */
const proj = { name: 'hero', w: 2, h: 2, frames: [[null, '#111111', null, null]], savedAt: '2026-07-27T00:00:00Z' };
const json = PF.pfSerializeProject(proj);
const back = PF.pfParseProject(json);
ok(back && back.name === 'hero' && back.w === 2 && back.frames.length === 1, 'serialize/parse round-trip');
eq(back.frames[0][1], '#111111', 'round-trip pixel intact');
eq(PF.pfParseProject('not json'), null, 'parse invalid json = null');
eq(PF.pfParseProject('{"app":"Other","frames":[[]]}'), null, 'parse foreign app = null');
eq(PF.pfParseProject(JSON.stringify({ app: 'PixelForge', w: 2, h: 2, frames: [[null]] })), null, 'parse wrong frame length = null');
eq(PF.pfParseProject(JSON.stringify({ app: 'PixelForge', w: 500, h: 2, frames: [[null, null]] })), null, 'parse oversize = null');
eq(PF.pfParseProject('42'), null, 'parse non-object = null');

/* ---- project list ops ---- */
const L0 = [];
const L1 = PF.pfUpsertProject(L0, { name: 'a', w: 2, h: 2, frames: [] });
eq(L1.length, 1, 'upsert into empty');
const L2 = PF.pfUpsertProject(L1, { name: 'b', w: 2, h: 2, frames: [] });
eq(L2.length, 2, 'upsert new appends');
const L3 = PF.pfUpsertProject(L2, { name: 'a', w: 4, h: 4, frames: [] });
eq(L3.length, 2, 'upsert existing replaces (no dup)');
eq(L3[0].w, 4, 'upsert replaces in place');
const L4 = PF.pfRemoveProject(L3, 'a');
eq(L4.length, 1, 'remove drops entry');
eq(L4[0].name, 'b', 'remove keeps others');
eq(PF.pfRemoveProject(L4, 'zzz').length, 1, 'remove missing = noop');

/* ---- constants ---- */
eq(PF.PF_APP, 'PixelForge', 'app constant');
eq(PF.PF_DEFAULT_PALETTE.length, 24, 'default palette 24 entries');
ok(PF.PF_DEFAULT_PALETTE[PF.PF_DEFAULT_PALETTE.length - 1] === null, 'palette last = transparent');
ok(PF.PF_MAX_UNDO >= 30, 'undo depth >= 30');

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
