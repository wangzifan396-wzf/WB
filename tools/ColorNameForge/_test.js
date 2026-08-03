const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
ok('red', C.n2h('red').value==='#ff0000');
ok('white', C.n2h('white').value==='#ffffff');
ok('tomato', C.n2h('tomato').value==='#ff6347');
ok('h2n', C.h2n('#ffd700').value==='gold');
ok('h2n2', C.h2n('#808080').value==='gray');
ok('bad', !!C.n2h('notacolor').error);
console.log((fail?'FAIL':'PASS')+' ColorNameForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);