const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
var r=C.rainbow('abc');
ok('spans', (r.value.match(/<span/g)||[]).length===3);
ok('color', r.value.indexOf('color:rgb')>=0);
ok('escape', C.rainbow('<x').value.indexOf('&lt;')>=0);
console.log((fail?'FAIL':'PASS')+' LolcatForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);