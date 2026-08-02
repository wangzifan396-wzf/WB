const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
function eq(a,b){ return JSON.stringify(a)===JSON.stringify(b); }
ok('basic', eq(A.qsParse('a=1&b=2'),{a:'1',b:'2'}));
ok('empty string', eq(A.qsParse(''),{}));
ok('leading ?', eq(A.qsParse('?x=1'),{x:'1'}));
ok('repeated -> array', eq(A.qsParse('a=1&a=2'),{a:['1','2']}));
ok('decode space', A.qsParse('name=John%20Doe').name==='John Doe');
ok('plus space', A.qsParse('q=a+b').q==='a b');
ok('single is string', typeof A.qsParse('a=1').a==='string');
ok('no value', eq(A.qsParse('a'),{a:''}));
ok('empty value', eq(A.qsParse('a='),{a:''}));
ok('stringify array', A.qsStringify({a:['1','2']})==='a=1&a=2');
ok('roundtrip', eq(A.qsParse(A.qsStringify({x:'hello world', y:'a&b'})),{x:'hello world', y:'a&b'}));
ok('stringify basic', /a=1/.test(A.qsStringify({a:'1',b:'2'})) && /b=2/.test(A.qsStringify({a:'1',b:'2'})));
console.log('QsForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
