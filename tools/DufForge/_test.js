
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
var t=C.table('/dev/sda1 500G 200G 280G').value;
ok('one', t.length===1);
ok('pct', t[0].pct===Math.round(200/500*100));
ok('bar', t[0].bar.length===40);
ok('avail', t[0].avail===280*1024*1024*1024);
console.log((fail?'FAIL':'PASS')+' DufForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);