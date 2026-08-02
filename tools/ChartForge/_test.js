"use strict";
// ChartForge kernel test: extract first <script> (CF kernel) and assert.
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const m = html.match(/<script>\s*"use strict";\s*var CF = \(function\(\)\{([\s\S]*?)\}\)\(\);\s*if\(typeof module/);
if (!m) { console.error('CF kernel script not found'); process.exit(1); }
const mod = { exports: {} };
const fn = new Function('module', 'exports', 'window', 'document', m[1]);
const CF = fn(mod, mod.exports, undefined, undefined);

let pass = 0, fail = 0;
function ok(name, cond){ if(cond){pass++;} else {fail++; console.error('FAIL: '+name);} }
function eq(name, a, b){ ok(name+' ('+JSON.stringify(a)+' === '+JSON.stringify(b)+')', a===b); }
function inc(name, a, b){ ok(name, String(a).indexOf(b)>=0); }

// CSV parse (quoted fields, escaped quotes)
const csv = CF.parseCSV('a,b,c\n1,2,"x,y"\n3,4,"he said ""hi"""');
eq('csv headers', csv.headers.join(','), 'a,b,c');
eq('csv row count', csv.rows.length, 2);
eq('csv quoted comma', csv.rows[0][2], 'x,y');
eq('csv escaped quote', csv.rows[1][2], 'he said "hi"');
// TSV
const tsv = CF.parseTSV('x\ty\n10\t20');
eq('tsv headers', tsv.headers.join(','), 'x,y');
eq('tsv row', tsv.rows[0].join(','), '10,20');
// JSON object array
const j1 = CF.parseJSON('[{"q":"Q1","v":1},{"q":"Q2","v":2}]');
eq('json headers', j1.headers.join(','), 'q,v');
eq('json rows', j1.rows.length, 2);
eq('json union keys', CF.parseJSON('[{"a":1},{"b":2}]').headers.sort().join(','), 'a,b');
// JSON 2D array
const j2 = CF.parseJSON('[["name","val"],["x",1],["y",2]]');
eq('json2d headers', j2.headers.join(','), 'name,val');
eq('json2d rows', j2.rows.length, 2);

// isNumericCol
const d = {headers:['q','sales','profit'], rows:[['Q1','120','40'],['Q2','180','70']]};
ok('numeric sales', CF.isNumericCol(d.rows,1)===true);
ok('non-numeric q', CF.isNumericCol(d.rows,0)===false);

// stats
const st = CF.stats(d.rows,1);
eq('stats sum', st.sum, 300);
eq('stats avg', st.avg, 150);
eq('stats min', st.min, 120);
eq('stats max', st.max, 180);
ok('stats null on text col', CF.stats(d.rows,0)===null);

// niceTicks
const nt = CF.niceTicks(0, 100, 5);
ok('niceTicks min 0', nt.min===0);
ok('niceTicks max >=100', nt.max>=100);
ok('niceTicks has ticks', nt.ticks.length>=2);
const nt2 = CF.niceTicks(47.3, 52.8, 5);
ok('niceTicks small range expands', nt2.max>52.8 && nt2.min<47.3);

// buildScene per type returns items
['bar','line','area','pie','doughnut','scatter'].forEach(function(type){
  var scene = CF.buildScene(900,560,d,{type:type, title:'T'});
  ok('scene '+type+' has items', scene && scene.items && scene.items.length>0);
  ok('scene '+type+' has title text', scene.items.some(function(it){return it.t==='text' && it.text==='T';}));
});
// bar scene has rect bars
var barScene = CF.buildScene(900,560,d,{type:'bar'});
ok('bar has rect', barScene.items.some(function(it){return it.t==='rect';}));
// line scene has path
var lineScene = CF.buildScene(900,560,d,{type:'line'});
ok('line has path', lineScene.items.some(function(it){return it.t==='path';}));
// pie scene has multiple path slices
var pieScene = CF.buildScene(900,560,d,{type:'pie'});
ok('pie has >=2 slices', pieScene.items.filter(function(it){return it.t==='path';}).length>=2);
// scatter uses 2 numeric cols
var sd = {headers:['x','y'], rows:[['1','2'],['3','4'],['5','6']]};
var scScene = CF.buildScene(900,560,sd,{type:'scatter'});
ok('scatter has circles', scScene.items.some(function(it){return it.t==='circle';}));

// renderCanvas guard (null ctx -> false, no throw)
ok('renderCanvas null ctx false', CF.renderCanvas(null, barScene)===false);
// renderCanvas with a fake ctx object works
var fakeCtx = { save(){},restore(){},beginPath(){},fillRect(){},clearRect(){},
  moveTo(){},lineTo(){},arc(){},arcTo(){},closePath(){},fill(){},stroke(){},
  translate(){},rotate(){},fillText(){},set fillStyle(v){},set strokeStyle(v){},
  set lineWidth(v){},set font(v){},set textAlign(v){},set textBaseline(v){},set globalAlpha(v){} };
ok('renderCanvas fake ctx true', CF.renderCanvas(fakeCtx, barScene)===true);

// renderSVG
var svg = CF.renderSVG(barScene);
inc('svg root', svg, '<svg');
inc('svg has rect', svg, '<rect');
inc('svg has text', svg, '<text');
var svgPie = CF.renderSVG(pieScene);
inc('svg pie path', svgPie, '<path');

// sampleData
const samp = CF.sampleData();
ok('sample is csv', samp.format==='csv');
ok('sample parses', CF.parseData(samp.text,'csv').rows.length===4);

// round-trip: scene stable
eq('scene deterministic', CF.buildScene(900,560,d,{type:'bar'}).items.length, barScene.items.length);

console.log('ChartForge kernel: '+pass+' passed, '+fail+' failed');
if(fail>0) process.exit(1);
