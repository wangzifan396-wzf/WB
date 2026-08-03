
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
ok('basic', C.replace('foo bar foo','foo','FOO',{global:true}).value.result==='FOO bar FOO');
ok('count', C.replace('foo bar foo','foo','X',{global:true}).value.count===2);
ok('nog', C.replace('foo bar foo','foo','X',{}).value.count===1);
ok('re', C.replace('a1 b2','\\d','#',{regex:true,global:true}).value.result==='a# b#');
ok('ci', C.replace('Foo bar','foo','x',{ignoreCase:true,global:true}).value.result==='x bar');
ok('noopt', C.replace('abc','xyz','q',{}).value.count===0);
console.log((fail?'FAIL':'PASS')+' SdForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);