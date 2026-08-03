const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
ok('cn123', C.cnToNum('一百二十三').value===123);
ok('cn12345', C.cnToNum('一万二千三百四十五').value===12345);
ok('cn305', C.cnToNum('三百零五').value===305);
ok('cn1e8', C.cnToNum('一亿').value===100000000);
ok('cn11', C.cnToNum('十一').value===11);
ok('cn1001', C.cnToNum('一千零一').value===1001);
ok('a2cn12345', C.numToCn(12345).value==='一万二千三百四十五');
ok('a2cn305', C.numToCn(305).value==='三百零五');
ok('a2cn15', C.numToCn(15).value==='十五');
ok('a2cn1e8', C.numToCn(100000000).value==='一亿');
ok('a2cn1001', C.numToCn(1001).value==='一千零一');
console.log((fail?'FAIL':'PASS')+' CnnumForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);