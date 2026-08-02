const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { console.error('FAIL: no <script> found'); process.exit(1); }

const mod = { exports: {} };
const fn = new Function('module', 'exports', 'require', m[1]);
fn(mod, mod.exports, require);
const A = mod.exports;

let passed = 0, failed = 0;
function ok(cond, msg) { if (cond) passed++; else { failed++; console.error('FAIL: ' + msg); } }

// ---- structural ----
ok(typeof A.createGraph === 'function', 'createGraph is a function');
ok(typeof A.addNode === 'function', 'addNode is a function');
ok(typeof A.addEdge === 'function', 'addEdge is a function');
ok(typeof A.deserialize === 'function', 'deserialize is a function');
ok(typeof A.routeEdge === 'function', 'routeEdge is a function');

// ---- createGraph / addNode ----
const g = A.createGraph();
ok(g.nodes.length === 0 && g.edges.length === 0, 'fresh graph is empty');
const n1 = A.addNode(g, { type: 'rect' });
const n2 = A.addNode(g, { type: 'ellipse', x: 300, y: 0 });
ok(n1.id === 'n1' && n2.id === 'n2', 'node ids are unique & sequential');
ok(n1.w === 130 && n1.h === 64 && n1.type === 'rect', 'addNode applies defaults');
ok(n2.x === 300 && n2.y === 0 && n2.type === 'ellipse', 'addNode applies props');

// ---- addEdge requires endpoints ----
ok(A.addEdge(g, { from: n1.id }) === null, 'addEdge without `to` returns null');
ok(A.addEdge(g, { to: n2.id }) === null, 'addEdge without `from` returns null');
const e1 = A.addEdge(g, { from: n1.id, to: n2.id });
ok(e1 && /^e\d+$/.test(e1.id) && g.edges.length === 1, 'addEdge creates edge with id');

// ---- removeNode cascades to edges ----
A.removeNode(g, n1.id);
ok(g.nodes.length === 1, 'removeNode removes the node');
ok(g.edges.length === 0, 'removeNode cascades to connected edges');

// ---- serialize / deserialize roundtrip ----
const g2 = A.createGraph();
const a = A.addNode(g2, { type: 'diamond', text: 'A\nB' });
const b = A.addNode(g2, { type: 'round', x: 200, y: 50 });
A.addEdge(g2, { from: a.id, to: b.id, label: 'yes' });
const ser = A.serialize(g2);
const g3 = A.deserialize(ser);
ok(JSON.stringify(g3.nodes) === JSON.stringify(g2.nodes), 'serialize/deserialize keeps nodes');
ok(JSON.stringify(g3.edges) === JSON.stringify(g2.edges), 'serialize/deserialize keeps edges');

// ---- validateGraph ----
const bad = { nodes: [{ id: 'a' }], edges: [{ from: 'a', to: 'z' }] };
ok(A.validateGraph(bad).ok === false, 'validateGraph flags dangling edge');
ok(A.validateGraph({ nodes: [], edges: [] }).ok === true, 'validateGraph accepts empty graph');
let threw = false;
try { A.deserialize(JSON.stringify(bad)); } catch (e) { threw = true; }
ok(threw === true, 'deserialize throws on invalid graph');

// ---- hitTestNode returns topmost (higher z) ----
const g4 = A.createGraph();
const low = A.addNode(g4, { x: 0, y: 0, w: 100, h: 100, text: 'low' });   // z 0
const top = A.addNode(g4, { x: 10, y: 10, w: 50, h: 50, text: 'top' });   // z 1
ok(A.hitTestNode(g4, 30, 30).id === top.id, 'hitTestNode returns topmost node');
ok(A.hitTestNode(g4, 80, 80).id === low.id, 'hitTestNode respects geometry');

// ---- getBounds ----
const bnd = A.getBounds(g4);
ok(bnd.x === 0 && bnd.y === 0 && bnd.w === 100 && bnd.h === 100, 'getBounds spans all nodes');

// ---- routeEdge ----
const straight = A.routeEdge(g2, g2.edges[0]);
ok(straight.length >= 2, 'routeEdge returns at least 2 points (straight)');

// ---- geometry helpers ----
ok(A.pointInRect(5, 5, { x: 0, y: 0, w: 10, h: 10 }) === true, 'pointInRect inside');
ok(A.pointInRect(50, 50, { x: 0, y: 0, w: 10, h: 10 }) === false, 'pointInRect outside');
ok(A.rectsIntersect({ x: 0, y: 0, w: 10, h: 10 }, { x: 5, y: 5, w: 10, h: 10 }) === true, 'rectsIntersect overlap');
ok(A.rectsIntersect({ x: 0, y: 0, w: 10, h: 10 }, { x: 20, y: 20, w: 5, h: 5 }) === false, 'rectsIntersect disjoint');

// ---- simpleGridLayout ----
const g5 = A.createGraph();
for (let i = 0; i < 5; i++) A.addNode(g5, {});
A.simpleGridLayout(g5, 4);
ok(g5.nodes[0].x === 40 && g5.nodes[1].x === 200 && g5.nodes[4].x === 40, 'simpleGridLayout positions in grid');

console.log('DiagramForge _test: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed ? 1 : 0);
