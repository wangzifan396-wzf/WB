
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
var h=C.highlight('var x = 1 // c','js').value;
ok('kw', h.indexOf('class="k"')>=0);
ok('num', h.indexOf('class="n"')>=0);
ok('esc', C.highlight('<a>','html').value.indexOf('&lt;')>=0);
ok('no-lt-destroy', C.highlight('if x < 2: pass','py').value.indexOf('&lt;')>=0);
var h2=C.highlight('def f(): return 1','py').value; ok('py-kw', h2.indexOf('class="k"')>=0);
console.log((fail?'FAIL':'PASS')+' BatForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);