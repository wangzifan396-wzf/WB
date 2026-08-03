const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
ok('basic', C.slug('Hello World').value==='hello-world');
ok('punct', C.slug('Café & Co.').value==='cafe-co');
ok('trim', C.slug('  A--B  ').value==='a-b');
ok('cn', /^[a-z0-9-]+$/.test(C.slug('你好 2026').value));
console.log((fail?'FAIL':'PASS')+' SlugifyForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);