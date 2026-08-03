const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
var cj=C.toJson('a,b\n1,2').value;
ok('cj', cj.indexOf('"a": "1"')>=0 && cj.indexOf('"b": "2"')>=0);
ok('quote', C.toJson('a\n"x,y"').value.indexOf('x,y')>=0);
var jc=C.toCsv('[{"a":"1","b":"2"}]').value;
ok('jc', jc==='a,b\n1,2');
ok('bad', !!C.toCsv('{bad').error);
console.log((fail?'FAIL':'PASS')+' CsvJsonForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);