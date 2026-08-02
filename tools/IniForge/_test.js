const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
function eq(a,b){ return JSON.stringify(a)===JSON.stringify(b); }
ok('section', eq(A.iniParse('[s]\na=1'),{s:{a:'1'}}));
ok('two sections', eq(A.iniParse('[a]\nx=1\n[b]\ny=2'),{a:{x:'1'},b:{y:'2'}}));
ok('semicolon comment', eq(A.iniParse('; c\n[s]\na=1'),{s:{a:'1'}}));
ok('hash comment', eq(A.iniParse('# c\n[s]\na=1'),{s:{a:'1'}}));
ok('quoted', eq(A.iniParse('[s]\na="hello"'),{s:{a:'hello'}}));
ok('roundtrip', eq(A.iniParse(A.iniStringify({s:{a:'1',b:'2'}})),{s:{a:'1',b:'2'}}));
ok('empty', eq(A.iniParse(''),{}));
ok('dup last wins', eq(A.iniParse('[s]\na=1\na=2'),{s:{a:'2'}}));
ok('multi keys', eq(A.iniParse('[s]\na=1\nb=2\nc=3'),{s:{a:'1',b:'2',c:'3'}}));
ok('value string type', typeof A.iniParse('[s]\na=1').s.a==='string');
ok('spaces in value', eq(A.iniParse('[s]\na=hello world'),{s:{a:'hello world'}}));
ok('value with equals', eq(A.iniParse('[s]\na=x=y'),{s:{a:'x=y'}}));
console.log('IniForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
