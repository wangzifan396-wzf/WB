const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
var f=C.freq('a a b','word').value;
ok('wcount', f.length===2 && f[0].token==='a' && f[0].count===2 && f[1].token==='b' && f[1].count===1);
var c=C.freq('aba','char').value;
ok('ccount', c.length===2 && c[0].token==='a' && c[0].count===2);
ok('top', C.freq('a b a c a','word',2).value.length===2);
ok('empty', C.freq('','word').value.length===0);
console.log((fail?'FAIL':'PASS')+' WordfreqForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);