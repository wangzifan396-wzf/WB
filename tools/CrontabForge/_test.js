const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
ok('explain', C.explain('0 0 * * *'.split(' ')).value.indexOf('每天')>=0);
ok('bad', !!C.explain('99 0 * * *'.split(' ')).error);
ok('len', !!C.explain('0 0 * *'.split(' ')).error);
var n=C.next('0 0 * * *','2026-01-01T00:00:00',2).value.split('\n');
ok('next', n.length===2 && (new Date(n[1])-new Date(n[0]))===86400000);
ok('wild', C.next('* * * * *','2026-01-01T00:00:00',1).value.length>0);
console.log((fail?'FAIL':'PASS')+' CrontabForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);