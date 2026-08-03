
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
ok('exact', C.search('abc',['abc']).value.length===1);
ok('fuzzy', C.search('mj',['src/main.js','src/utils.js']).value.length>=1);
ok('order', C.search('main',['src/main.js','src/domain.js']).value[0].text==='src/main.js');
ok('none', C.search('zzz',['abc']).value.length===0);
ok('empty', C.search('',['a','b']).value.length===2);
ok('score', C.score('ma', 'src/main.js')>=0);
console.log((fail?'FAIL':'PASS')+' FzfForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);