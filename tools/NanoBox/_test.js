const fs = require('fs');
const vm = require('vm');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
const code = scripts.find(b => /var TOOLS/.test(b)) || scripts[0];

// in-memory localStorage mock
const store = {};
const localStorage = {
  getItem: k => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: k => { delete store[k]; }
};

const sandbox = {
  module: { exports: {} },
  exports: {},
  console,
  Math, JSON, Date, parseInt, parseFloat, isNaN, isFinite,
  Number, String, Array, Object, RegExp,
  localStorage,
  setTimeout
};
sandbox.exports = sandbox.module.exports;
vm.createContext(sandbox);
vm.runInContext(code, sandbox);
const M = sandbox.module.exports;

let pass = 0, fail = 0;
function ok(name, cond){ if(cond){ pass++; } else { fail++; console.log('  FAIL: ' + name); } }
function approx(a, b, e){ return Math.abs(a - b) < (e || 1e-9); }

// ---- fuzzy / filter ----
ok('fuzzyScore json->JsonForge > 0', M.fuzzyScore('json', 'JsonForge 正则表达式') > 0);
ok('fuzzyScore xyz->JsonForge == 0', M.fuzzyScore('xyz', 'JsonForge') === 0);
ok('fuzzyScore empty -> 0', M.fuzzyScore('', 'anything') === 0);
ok('filterTools json nonempty', M.filterTools(M.TOOLS, 'json').length > 0);
ok('filterTools json first is JsonForge', M.filterTools(M.TOOLS, 'json')[0].tool.id === 'JsonForge');
ok('filterTools case-insensitive', M.filterTools(M.TOOLS, 'JSON').length === M.filterTools(M.TOOLS, 'json').length);
ok('filterTools empty -> []', M.filterTools(M.TOOLS, '').length === 0);
ok('filterTools no match -> []', M.filterTools(M.TOOLS, 'zzzzz').length === 0);
ok('filterTools max cap 8', M.filterTools(M.TOOLS, 'a', 8).length <= 8);
ok('TOOLS has 31 entries', M.TOOLS.length === 31);
ok('every tool has id/name/cat/desc/tags', M.TOOLS.every(t => t.id && t.name && t.cat && t.desc && Array.isArray(t.tags)));

// ---- math evaluator ----
ok('eval 2+3*4 == 14', M.evalExpr('2+3*4') === 14);
ok('eval (1+2)^2 == 9', M.evalExpr('(1+2)^2') === 9);
ok('eval 2^3^2 == 512 (right assoc)', M.evalExpr('2^3^2') === 512);
ok('eval sqrt(16) == 4', M.evalExpr('sqrt(16)') === 4);
ok('eval -2*3 == -6', M.evalExpr('-2*3') === -6);
ok('eval -2^2 == -4', M.evalExpr('-2^2') === -4);
ok('eval 10%3 == 1', M.evalExpr('10%3') === 1);
ok('eval 1/4 == 0.25', M.evalExpr('1/4') === 0.25);
ok('eval pi ~ 3.14159', approx(M.evalExpr('pi'), Math.PI));
ok('eval 2*pi ~ 6.283', approx(M.evalExpr('2*pi'), 2 * Math.PI));
ok('eval 100/8 == 12.5', M.evalExpr('100/8') === 12.5);
ok('eval 3+4*2/(1-5)^2 == 3.5', approx(M.evalExpr('3+4*2/(1-5)^2'), 3.5));
ok('eval log(100) == 2', M.evalExpr('log(100)') === 2);
ok('eval ln(e) == 1', M.evalExpr('ln(e)') === 1);
ok('eval abs(-5) == 5', M.evalExpr('abs(-5)') === 5);
ok('eval round(2.5) == 3', M.evalExpr('round(2.5)') === 3);
ok('eval 1/0 throws', (function(){ try { M.evalExpr('1/0'); return false; } catch(e){ return true; } })());
ok('eval 2+ throws', (function(){ try { M.evalExpr('2+'); return false; } catch(e){ return true; } })());
ok('eval foo(2) throws', (function(){ try { M.evalExpr('foo(2)'); return false; } catch(e){ return true; } })());
ok('eval )( throws', (function(){ try { M.evalExpr(')('); return false; } catch(e){ return true; } })());

// ---- isMathExpr ----
ok('isMath 2+2*3 true', M.isMathExpr('2+2*3') === true);
ok('isMath 1/0 false', M.isMathExpr('1/0') === false);
ok('isMath sqrt(16) true', M.isMathExpr('sqrt(16)') === true);
ok('isMath hello false', M.isMathExpr('hello') === false);
ok('isMath empty false', M.isMathExpr('') === false);
ok('isMath 2+2 true', M.isMathExpr('2+2') === true);
ok('isMath pi false (no digit)', M.isMathExpr('pi') === false);

// ---- fmtNum ----
ok('fmtNum 14', M.fmtNum(14) === '14');
ok('fmtNum 0.1+0.2 == 0.3', M.fmtNum(0.1 + 0.2) === '0.3');
ok('fmtNum 1/3', M.fmtNum(1/3) === '0.333333333333');
ok('fmtNum Infinity', M.fmtNum(Infinity) === '∞');
ok('fmtNum NaN', M.fmtNum(NaN) === '—');

// ---- buildDemoUrl ----
ok('buildDemoUrl', M.buildDemoUrl('JsonForge') === 'https://wangzifan396-wzf.github.io/JsonForge/');

// ---- recentAdd ----
ok('recentAdd empty -> [A]', M.recentAdd({recent:[]}, 'A').recent[0] === 'A');
ok('recentAdd dedupe+front', (function(){ var s = M.recentAdd({recent:['A','B']}, 'A'); return s.recent.length === 2 && s.recent[0] === 'A'; })());
ok('recentAdd cap 6', (function(){ var s = M.recentAdd({recent:['A','B','C','D','E','F']}, 'G', 6); return s.recent.length === 6 && s.recent[0] === 'G'; })());

// ---- escapeHtml ----
ok('escapeHtml', M.escapeHtml('<b>&"') === '&lt;b&gt;&amp;&quot;');

// ---- state persistence ----
(function(){
  var s = M.defaultState();
  s = M.recentAdd(s, 'X');
  M.saveState(s);
  var l = M.loadState();
  ok('save/load roundtrip', l.recent[0] === 'X');
})();
ok('defaultState recent []', Array.isArray(M.defaultState().recent) && M.defaultState().recent.length === 0);

console.log('\nNanoBox 纯函数测试: ' + pass + ' 通过, ' + fail + ' 失败');
process.exit(fail ? 1 : 0);
