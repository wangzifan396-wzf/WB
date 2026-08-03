const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
ok('full', C.toFull('abc')==='ａｂｃ');
ok('fullsp', C.toFull(' ')==='　');
ok('half', C.toHalf('ａｂｃ')==='abc');
ok('rt', C.toHalf(C.toFull('A1'))==='A1');
console.log((fail?'FAIL':'PASS')+' ZenkakuForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);