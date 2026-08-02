
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
var csv='name,age,city\nAlice,30,Beijing\nBob,25,Shanghai\nCarol,35,Beijing';
var p=C.parseCsv(csv).value;
ok('cols', p.columns.join(',')==='name,age,city');
ok('rows', p.rows.length===3 && p.rows[0].age==='30');
var r=C.runSql(csv,"SELECT name FROM t WHERE city='Beijing'").value;
ok('where', r.rows.length===2);
var r2=C.runSql(csv,'SELECT * FROM t WHERE age > 26 ORDER BY age DESC').value;
ok('cmp', r2.rows.length===2 && r2.rows[0].name==='Carol');
ok('limit', C.runSql(csv,'SELECT * FROM t LIMIT 1').value.rows.length===1);
ok('like', C.runSql(csv,"SELECT * FROM t WHERE city LIKE 'Bei'").value.rows.length===2);
console.log((fail?'FAIL':'PASS')+' QsvForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);