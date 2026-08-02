const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
function near(a,b){ return Math.abs(a-b)<1e-9; }
ok('basic add', A.exprEval('1+2').value===3);
ok('precedence', A.exprEval('2+3*4').value===14);
ok('parens', A.exprEval('(2+3)*4').value===20);
ok('power right-assoc', A.exprEval('2^3^2').value===512);
ok('unary minus', A.exprEval('-3+5').value===2);
ok('double unary', A.exprEval('2*-3').value===-6);
ok('modulo', A.exprEval('10%3').value===1);
ok('variable', A.exprEval('x*2', {x:21}).value===42);
ok('undefined var error', A.exprEval('y+1').error!==null);
ok('div by zero error', A.exprEval('1/0').error!==null);
ok('unbalanced error', A.exprEval('(1+2').error!==null);
ok('bad char error', A.exprEval('1 @ 2').error!==null);
ok('func sqrt', A.exprEval('sqrt(16)').value===4);
ok('func min', A.exprEval('min(4,9)').value===4);
ok('func max nested', A.exprEval('max(1, min(5, 3))').value===3);
ok('const pi', near(A.exprEval('pi').value, Math.PI));
ok('composite', A.exprEval('(2 + 3) * x ^ 2 - min(4, 9)', {x:5}).value===121);
ok('empty error', A.exprEval('').error!==null);
console.log('ExprForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
