
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
var logs='2024-01-01 10:00:01 INFO ok\n2024-01-01 10:00:02 ERROR boom\n2024-01-01 10:00:03 WARN x\n2024-01-01 10:00:04 ERROR zap';
var p=C.parse(logs).value;
ok('rows', p.length===4);
ok('lvl', p[1].level==='ERROR');
ok('time', p[0].time==='2024-01-01 10:00:01');
var e=C.query(p,"WHERE level='ERROR'").value;
ok('filter', e.length===2 && e[0].raw.indexOf('boom')>=0);
ok('limit', C.query(p,'LIMIT 1').value.length===1);
ok('order', C.query(p,'ORDER BY n').value[0].n===1);
console.log((fail?'FAIL':'PASS')+' LnavForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);