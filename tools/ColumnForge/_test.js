const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
var r=C.align('a bb\nccc d');
ok('rows', r.value.split('\n').length===2);
ok('aligned', (function(){var L=r.value.split('\n');return L[0].length===L[1].length;})());
ok('empty', C.align('').value==='');
console.log((fail?'FAIL':'PASS')+' ColumnForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);