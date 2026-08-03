const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
var r=C.dump('A');
ok('one', r.value.indexOf('41')>=0);
ok('offset', r.value.slice(0,8)==='00000000');
ok('ascii', r.value.indexOf('|A|')>=0);
ok('empty', C.dump('').value==='00000000');
console.log((fail?'FAIL':'PASS')+' HexdumpForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);