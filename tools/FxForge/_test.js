const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
ok('pretty', C.pretty('{"a":1}').value==='{\n  "a": 1\n}');
ok('get', C.get('{"u":{"n":"ada"}}','.u.n').value==='ada');
ok('getarr', C.get('{"r":["x","y"]}','.r[1]').value==='y');
ok('path', C.parsePath('.a.b[0].c').length===4);
ok('bad', !!C.pretty('{bad').error);
console.log((fail?'FAIL':'PASS')+' FxForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);