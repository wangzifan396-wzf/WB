const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
ok('e0', C.encode('0').value==='0');
ok('e61', C.encode('61').value==='z');
ok('e62', C.encode('62').value==='10');
ok('d10', C.decode('10').value==='62');
ok('rt', (function(){var s=C.encode('123456789').value; return C.decode(s).value==='123456789';})());
ok('bad', !!C.decode('@').error);
console.log((fail?'FAIL':'PASS')+' Base62Forge '+pass+'/'+(pass+fail));process.exit(fail?1:0);