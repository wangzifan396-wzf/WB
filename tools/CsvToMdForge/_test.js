const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
var md=C.toMd('a,b,c\n1,2,3').value;
ok('hdr', md.indexOf('| a | b | c |')>=0);
ok('sep', md.split('\n')[1].indexOf('---')>=0);
ok('row', md.indexOf('| 1 | 2 | 3 |')>=0);
var q=C.toMd('name,note\nA,"hello, world"').value;
ok('quote', q.indexOf('hello, world')>=0 && q.indexOf('"')<0);
console.log((fail?'FAIL':'PASS')+' CsvToMdForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);