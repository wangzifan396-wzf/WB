const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
function near(a,b){ return Math.abs(a-b)<1e-9; }
ok('precedence', A.evaluate('2+3*4')===14);
ok('paren', A.evaluate('(2+3)*4')===20);
ok('power', A.evaluate('2^10')===1024);
ok('power right assoc', A.evaluate('2^3^2')===512);
ok('unary minus', A.evaluate('-5+3')===-2);
ok('unary minus paren', A.evaluate('3*(-2)')===-6);
ok('div', A.evaluate('10/4')===2.5);
ok('mod', A.evaluate('10%3')===1);
ok('sqrt', A.evaluate('sqrt(16)')===4);
ok('abs', A.evaluate('abs(-7)')===7);
ok('pi', near(A.evaluate('pi'), Math.PI));
ok('e', near(A.evaluate('e'), Math.E));
ok('const expr', near(A.evaluate('pi*2'), 2*Math.PI));
ok('func chained', near(A.evaluate('sqrt(2^4)'), 4));
ok('div zero throws', (function(){try{A.evaluate('1/0');return false;}catch(e){return true;}})());
ok('bad expr throws', (function(){try{A.evaluate('2+');return false;}catch(e){return true;}})());
console.log('MathForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
