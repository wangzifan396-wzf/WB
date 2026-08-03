
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
var a=C.aggregate('mod 480M\nsrc 12M').value;
ok('entries', a.entries.length===2);
ok('pct', a.entries[0].name==='mod' && a.entries[0].pct===Math.round(480/(480+12)*100));
ok('bar', typeof a.entries[0].bar==='string' && a.entries[0].bar.length===40);
ok('size', C.parseSize('2K')===2048);
console.log((fail?'FAIL':'PASS')+' DustForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);