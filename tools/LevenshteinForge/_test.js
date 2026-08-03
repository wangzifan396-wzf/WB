const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
ok('kitten', C.dist('kitten','sitting').value===3);
ok('empty', C.dist('','abc').value===3);
ok('same', C.dist('same','same').value===0);
ok('flaw', C.dist('flaw','lawn').value===2);
ok('chinese', C.dist('中文','中文字').value===1);
console.log((fail?'FAIL':'PASS')+' LevenshteinForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);