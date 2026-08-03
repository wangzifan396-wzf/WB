const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
ok('1500', C.toHuman(1500).value==='1.5 K');
ok('2M', C.toHuman(2000000).value==='2 M');
ok('0', C.toHuman(0).value==='0');
ok('neg', C.toHuman(-1500).value==='-1.5 K');
ok('fh', C.fromHuman('1.5K').value==='1500');
ok('fM', C.fromHuman('2M').value==='2000000');
ok('bad', !!C.toHuman('x').error);
console.log((fail?'FAIL':'PASS')+' NumfmtForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);