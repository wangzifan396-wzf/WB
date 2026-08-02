/* WhiteboardForge kernel tests - Node, no deps. */
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { console.error('no script'); process.exit(1); }
const mod = { exports: {} };
new Function('module', 'exports', 'require', m[1])(mod, mod.exports, require);
const WF = mod.exports;

let pass = 0, fail = 0;
function ok(name, cond) { if (cond) pass++; else { fail++; console.error('FAIL:', name); } }
function eq(name, a, b) { ok(name, a === b); }

ok('exports.create', typeof WF.create === 'function');
ok('exports.bounds', typeof WF.bounds === 'function');
ok('exports.hitTest', typeof WF.hitTest === 'function');
ok('exports.serialize', typeof WF.serialize === 'function');
ok('exports.deserialize', typeof WF.deserialize === 'function');
ok('exports.fit', typeof WF.fit === 'function');
ok('exports.toSVG', typeof WF.toSVG === 'function');
eq('version', WF.version(), '1.0.0');

// create defaults
let r = WF.create('rect', { x: 10, y: 20, w: 100, h: 50 });
eq('create type', r.type, 'rect');
eq('create id', typeof r.id, 'string');
eq('create w', r.w, 100);

// bounds
let shapes = [WF.create('rect', { x: 0, y: 0, w: 100, h: 100 }), WF.create('rect', { x: 200, y: 50, w: 30, h: 30 })];
let b = WF.bounds(shapes);
eq('bounds minX', b.minX, 0);
eq('bounds maxX', b.maxX, 230);
eq('bounds maxY', b.maxY, 100);

// hitTest inside rect
let hit = WF.hitTest(shapes, 50, 50, 6);
ok('hit rect inside', hit && hit.type === 'rect');

// hitTest outside
ok('miss outside', WF.hitTest(shapes, 400, 400, 6) === null);

// hitTest topmost (last drawn wins)
let stacked = [WF.create('rect', { x: 0, y: 0, w: 100, h: 100 }), WF.create('ellipse', { x: 10, y: 10, w: 50, h: 50 })];
let top = WF.hitTest(stacked, 30, 30, 6);
ok('hit topmost ellipse', top && top.type === 'ellipse');

// hitTest line
let line = WF.create('line', { points: [{ x: 0, y: 0 }, { x: 100, y: 0 }] });
ok('hit line near', WF.hitTest([line], 50, 2, 6) !== null);
ok('miss line far', WF.hitTest([line], 50, 40, 6) === null);

// hitTest free
let free = WF.create('free', { points: [{ x: 0, y: 0 }, { x: 50, y: 50 }, { x: 100, y: 0 }] });
ok('hit free', WF.hitTest([free], 25, 25, 8) !== null);

// serialize round-trip
let ser = WF.serialize(shapes);
let back = WF.deserialize(ser);
eq('ser length', back.length, 2);
eq('ser x', back[1].x, 200);

// deserialize invalid
eq('deser invalid', WF.deserialize('not json').length, 0);

// fit
let f = WF.fit(shapes, 800, 600, 40);
ok('fit scale finite', isFinite(f.scale) && f.scale > 0);
ok('fit tx finite', isFinite(f.tx));

// toSVG
let svg = WF.toSVG(shapes);
ok('svg root', svg.indexOf('<svg') >= 0);
ok('svg rect', svg.indexOf('<rect') >= 0);
ok('svg closing', svg.indexOf('</svg>') >= 0);

// toSVG with text/note/line/arrow/free
let mixed = [
  WF.create('note', { x: 0, y: 0, w: 80, h: 60, text: 'Hi <b>' }),
  WF.create('text', { x: 0, y: 0, text: 'T&U' }),
  WF.create('arrow', { points: [{ x: 0, y: 0 }, { x: 10, y: 10 }] }),
  WF.create('free', { points: [{ x: 0, y: 0 }, { x: 5, y: 5 }] })
];
let svg2 = WF.toSVG(mixed);
ok('svg escapes text', svg2.indexOf('&lt;b&gt;') >= 0 && svg2.indexOf('T&amp;U') >= 0);
ok('svg arrow', svg2.indexOf('<line') >= 0);
ok('svg path free', svg2.indexOf('<path') >= 0);

// clone independence
let c = WF.clone(shapes);
c.push(WF.create('rect', {}));
eq('clone independent', WF.clone(shapes).length, 2);

// e2e
let e2e = (function(){
  var s = [WF.create('rect', { x: 5, y: 5, w: 40, h: 40 })];
  var hit = WF.hitTest(s, 20, 20, 6);
  var out = WF.toSVG(s);
  return hit && out.indexOf('<rect') >= 0;
})();
ok('e2e', e2e);

console.log('WhiteboardForge tests: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
