
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
ok('js', (function(){var r=C.count('// c\nvar a=1;\n/* x */','js').value; return r.total===3 && r.code===1 && r.comment===2;})());
ok('py', (function(){var r=C.count('# c\nx=1\n\n','python').value; return r.total===3 && r.blank===1 && r.comment===1 && r.code===1;})());
ok('blank', (function(){var r=C.count('a\n\nb','js').value; return r.blank===1;})());
console.log((fail?'FAIL':'PASS')+' TokeiForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);