
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
var h=C.pretty('--- a\n+++ b\n@@ -1 +1 @@\n-a\n+b').value;
ok('add', h.indexOf('class="dl add"')>=0);
ok('del', h.indexOf('class="dl del"')>=0);
ok('h', h.indexOf('class="dl h"')>=0);
ok('esc', C.esc('<x>')==='&lt;x&gt;');
console.log((fail?'FAIL':'PASS')+' DeltaForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);