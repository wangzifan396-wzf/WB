
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
var t=C.tree('a/b/c\na/b/d\na/e').value;
ok('root', t.indexOf('.')===0);
ok('node', /[├└]── e/.test(t));
ok('nest', t.split('\n').length>=4);
ok('branch', t.indexOf('└──')>=0 || t.indexOf('├──')>=0);
console.log((fail?'FAIL':'PASS')+' EzaForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);