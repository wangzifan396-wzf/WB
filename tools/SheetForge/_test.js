/* SheetForge kernel tests */
'use strict';
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { console.error('FAIL: no <script> block'); process.exit(1); }

const mod = { exports: {} };
new Function('module', 'exports', 'require', m[1])(mod, mod.exports, require);
const SF = mod.exports;

let pass = 0, fail = 0;
function ok(cond, name) { if (cond) pass++; else { fail++; console.error('FAIL: ' + name); } }
function eq(a, b, name) {
  if (a === b) pass++;
  else { fail++; console.error('FAIL: ' + name + '\n  got:      ' + JSON.stringify(a) + '\n  expected: ' + JSON.stringify(b)); }
}

/* ---------- A1 refs ---------- */
eq(SF.colToIndex('A'), 0, 'colToIndex A');
eq(SF.colToIndex('Z'), 25, 'colToIndex Z');
eq(SF.colToIndex('AA'), 26, 'colToIndex AA');
eq(SF.colToIndex('AZ'), 51, 'colToIndex AZ');
eq(SF.indexToCol(0), 'A', 'indexToCol 0');
eq(SF.indexToCol(25), 'Z', 'indexToCol 25');
eq(SF.indexToCol(26), 'AA', 'indexToCol 26');
eq(SF.indexToCol(701), 'ZZ', 'indexToCol 701');
eq(SF.refToA1(2, 4), 'C5', 'refToA1');
ok(SF.parseRef('B3').col === 1 && SF.parseRef('B3').row === 2, 'parseRef B3');
ok(SF.parseRef('$B$3').col === 1, 'parseRef absolute $B$3');
eq(SF.parseRef('3B'), null, 'parseRef invalid');
eq(SF.expandRange('A1', 'B2').join(','), 'A1,B1,A2,B2', 'expandRange 2x2');
eq(SF.expandRange('B2', 'A1').join(','), 'A1,B1,A2,B2', 'expandRange reversed');

/* ---------- tokenize / parse ---------- */
(function () {
  const t = SF.tokenize('=1' === '=1' ? 'SUM(A1:B2)+3.5e2' : '');
  ok(t.some(x => x.t === 'fn' && x.v === 'SUM'), 'tokenize: fn');
  ok(t.some(x => x.t === 'range' && x.a === 'A1' && x.b === 'B2'), 'tokenize: range');
  ok(t.some(x => x.t === 'num' && x.v === 350), 'tokenize: sci number');

  const t2 = SF.tokenize('"he said ""hi"""&A1');
  ok(t2[0].t === 'str' && t2[0].v === 'he said "hi"', 'tokenize: escaped quotes');

  const ast = SF.parse('1+2*3');
  eq(SF.evalAst(ast, () => 0), 7, 'parse: precedence 1+2*3');
  eq(SF.evalAst(SF.parse('(1+2)*3'), () => 0), 9, 'parse: parens');
  eq(SF.evalAst(SF.parse('2^3^2'), () => 0), 512, 'parse: ^ right assoc');
  eq(SF.evalAst(SF.parse('-3+5'), () => 0), 2, 'parse: unary minus');
  eq(SF.evalAst(SF.parse('10%3'), () => 0), 1, 'parse: modulo');
  let threw = false;
  try { SF.parse('1+'); } catch (e) { threw = true; }
  ok(threw, 'parse: trailing op throws');
  threw = false;
  try { SF.parse('SUM(1,2'); } catch (e) { threw = true; }
  ok(threw, 'parse: unclosed call throws');
})();

/* ---------- extractRefs ---------- */
(function () {
  const deps = SF.extractRefs(SF.parse('A1+SUM(B1:B3)*C2'));
  eq(deps.join(','), 'A1,B1,B2,B3,C2', 'extractRefs: refs + range expanded');
})();

/* ---------- eval: functions ---------- */
(function () {
  const vals = { A1: 1, A2: 2, A3: 3, B1: 'x', B2: '' };
  const getVal = r => (r in vals ? vals[r] : '');
  const ev = src => SF.evalAst(SF.parse(src), getVal);

  eq(ev('SUM(A1:A3)'), 6, 'SUM range');
  eq(ev('SUM(A1,A3,10)'), 14, 'SUM args');
  eq(ev('AVG(A1:A3)'), 2, 'AVG');
  eq(ev('AVERAGE(A1:A3)'), 2, 'AVERAGE alias');
  eq(ev('MIN(A1:A3)'), 1, 'MIN');
  eq(ev('MAX(A1:A3)'), 3, 'MAX');
  eq(ev('COUNT(A1:B2)'), 2, 'COUNT skips text/empty');
  eq(ev('COUNTA(A1:B2)'), 3, 'COUNTA counts non-empty');
  eq(ev('ABS(-5)'), 5, 'ABS');
  eq(ev('ROUND(2.675,2)'), 2.68, 'ROUND banker-safe 2.675');
  eq(ev('ROUND(1.005,2)'), 1.01, 'ROUND 1.005');
  eq(ev('FLOOR(2.9)'), 2, 'FLOOR');
  eq(ev('CEIL(2.1)'), 3, 'CEIL');
  eq(ev('SQRT(16)'), 4, 'SQRT');
  eq(ev('POW(2,10)'), 1024, 'POW');
  eq(ev('MOD(10,3)'), 1, 'MOD');
  eq(ev('CONCAT("a",1,"b")'), 'a1b', 'CONCAT');
  eq(ev('LEN("hello")'), 5, 'LEN');
  eq(ev('UPPER("aB")'), 'AB', 'UPPER');
  eq(ev('LOWER("aB")'), 'ab', 'LOWER');
  eq(ev('TRIM("  x  ")'), 'x', 'TRIM');
  eq(ev('IF(A1>0,"yes","no")'), 'yes', 'IF true');
  eq(ev('IF(A1>5,"yes","no")'), 'no', 'IF false');
  eq(ev('IF(A1>5,"yes")'), false, 'IF no-else returns false');
  eq(ev('"a"&"b"&1'), 'ab1', 'concat op &');
  eq(ev('1=1'), true, 'cmp =');
  eq(ev('1<>2'), true, 'cmp <>');
  eq(ev('"a"<"b"'), true, 'cmp string');
  eq(ev('SUM(A1:A3)>=6'), true, 'cmp with call');

  let threw = false;
  try { ev('1/0'); } catch (e) { threw = String(e.message).indexOf('#DIV/0!') >= 0; }
  ok(threw === true, 'DIV/0 throws');
  threw = false;
  try { ev('NOPE(1)'); } catch (e) { threw = String(e.message).indexOf('#NAME?') >= 0; }
  ok(threw === true, 'unknown fn -> #NAME?');
  threw = false;
  try { ev('SQRT(-1)'); } catch (e) { threw = String(e.message).indexOf('#NUM!') >= 0; }
  ok(threw === true, 'SQRT(-1) -> #NUM!');
})();

/* ---------- sheet model + recalc ---------- */
(function () {
  const s = SF.makeSheet(10, 5);
  SF.setCell(s, 'A1', '10');
  SF.setCell(s, 'A2', '20');
  SF.setCell(s, 'A3', '=A1+A2');
  eq(SF.display(s, 'A3'), '30', 'recalc: basic formula');

  SF.setCell(s, 'A1', '15');
  eq(SF.display(s, 'A3'), '35', 'recalc: dependency propagates');

  SF.setCell(s, 'A4', '=A3*2');
  eq(SF.display(s, 'A4'), '70', 'recalc: chained deps');
  SF.setCell(s, 'A2', '5');
  eq(SF.display(s, 'A4'), '40', 'recalc: chain propagates through');

  /* cycle detection */
  SF.setCell(s, 'B1', '=B2');
  SF.setCell(s, 'B2', '=B1');
  eq(SF.display(s, 'B1'), '#CYCLE!', 'cycle: B1 flagged');
  eq(SF.display(s, 'B2'), '#CYCLE!', 'cycle: B2 flagged');
  eq(SF.display(s, 'A4'), '40', 'cycle: unrelated cells unaffected');

  /* self reference */
  SF.setCell(s, 'C1', '=C1+1');
  eq(SF.display(s, 'C1'), '#CYCLE!', 'cycle: self-ref');

  /* break the cycle */
  SF.setCell(s, 'B2', '7');
  eq(SF.display(s, 'B1'), '7', 'cycle: resolves after break');

  /* error propagation */
  SF.setCell(s, 'D1', '=1/0');
  SF.setCell(s, 'D2', '=D1+1');
  eq(SF.display(s, 'D1'), '#DIV/0!', 'error: div0 shown');
  eq(SF.display(s, 'D2'), '#DIV/0!', 'error: propagates to dependents');

  /* parse error */
  SF.setCell(s, 'E1', '=SUM(');
  ok(SF.display(s, 'E1').indexOf('#PARSE') === 0, 'error: parse error shown');

  /* clear a cell */
  SF.setCell(s, 'A1', '');
  ok(!s.cells.A1, 'setCell: empty removes cell');
  eq(SF.display(s, 'A3'), '5', 'recalc: removed cell counts as 0/empty');

  /* literal types */
  SF.setCell(s, 'F1', 'hello');
  SF.setCell(s, 'F2', '3.14');
  eq(SF.display(s, 'F1'), 'hello', 'literal: string');
  eq(SF.display(s, 'F2'), '3.14', 'literal: number');
  SF.setCell(s, 'F3', '=LEN(F1)&"-"&F2*2');
  eq(SF.display(s, 'F3'), '5-6.28', 'formula: mixed string/number');
})();

/* ---------- CSV ---------- */
(function () {
  const rows = SF.parseCSV('a,b\n"x,y","he said ""hi"""\n1,2');
  eq(rows.length, 3, 'parseCSV: rows');
  eq(rows[1][0], 'x,y', 'parseCSV: quoted comma');
  eq(rows[1][1], 'he said "hi"', 'parseCSV: escaped quotes');

  const s = SF.fromCSV('name,qty\nA,2\nB,3\n,=SUM(B2:B3)');
  eq(SF.display(s, 'B4'), '5', 'fromCSV: formulas evaluated');
  eq(SF.display(s, 'A2'), 'A', 'fromCSV: text preserved');

  const csv = SF.toCSV(s, false);
  ok(csv.indexOf('=SUM(B2:B3)') >= 0, 'toCSV raw: formula kept');
  const csvV = SF.toCSV(s, true);
  ok(csvV.indexOf('=') < 0 && csvV.indexOf('5') >= 0, 'toCSV values: formula evaluated');

  /* roundtrip */
  const s2 = SF.fromCSV(csv);
  eq(SF.display(s2, 'B4'), '5', 'CSV roundtrip preserves formulas');
})();

/* ---------- serialize ---------- */
(function () {
  const s = SF.makeSheet(8, 4);
  SF.setCell(s, 'A1', '2');
  SF.setCell(s, 'A2', '=A1^10');
  const json = SF.serialize(s);
  const s2 = SF.deserialize(json);
  eq(SF.display(s2, 'A2'), '1024', 'serialize/deserialize roundtrip');
  eq(s2.rows, 8, 'deserialize: dims kept');
})();

/* ---------- sample ---------- */
(function () {
  const s = SF.sampleSheet();
  eq(SF.display(s, 'D2'), '398', 'sample: B2*C2');
  eq(SF.display(s, 'D5'), '1994', 'sample: SUM');
  eq(SF.display(s, 'B7'), '532.33', 'sample: ROUND(AVG)');
  eq(SF.display(s, 'B8'), '1299', 'sample: MAX');
  eq(SF.display(s, 'B9'), '1794.6', 'sample: IF discount');
})();

console.log('SheetForge tests: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail === 0 ? 0 : 1);
