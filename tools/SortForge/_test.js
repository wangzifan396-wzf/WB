const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
ok('asc', C.sortLines('3\n1\n2',{}).value==='1\n2\n3');
ok('numrev', C.sortLines('3\n1\n2',{numeric:true,reverse:true}).value==='3\n2\n1');
ok('uniq', C.sortLines('a\na\nb',{unique:true}).value==='a\nb');
ok('shuffle', (function(){ var r=C.sortLines('a\nb\nc',{shuffle:true}).value.split('\n').sort().join(','); return r==='a,b,c'; })());
ok('empty', C.sortLines('',{}).value==='');
console.log((fail?'FAIL':'PASS')+' SortForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);