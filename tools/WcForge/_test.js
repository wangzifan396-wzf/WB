const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
var r=C.count('a b c\n');
ok('lines', r.value.lines===1);
ok('words', r.value.words===3);
ok('chars', r.value.chars===6);
ok('bytes', r.value.bytes===6);
ok('empty', C.count('').value.lines===0);
console.log((fail?'FAIL':'PASS')+' WcForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);