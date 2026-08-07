
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('toCamel', A.toCamel('hello world')==='helloWorld');
ok('toPascal', A.toPascal('hello world')==='HelloWorld');
ok('toSnake', A.toSnake('HelloWorld')==='hello_world');
ok('toKebab', A.toKebab('helloWorld')==='hello-world');
ok('toTitle', A.toTitle('hello world')==='Hello World');
ok('toSentence', A.toSentence('HELLO WORLD')==='Hello world');
ok('toToggle', A.toToggle('Hello')==='hELLO');
ok('toAlternating', A.toAlternating('hello')==='hElLo');
console.log('CaseConvertForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
