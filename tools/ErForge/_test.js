
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
var ddl='CREATE TABLE users (id INT PRIMARY KEY, name VARCHAR(64));\nCREATE TABLE posts (id INT PRIMARY KEY, user_id INT, FOREIGN KEY (user_id) REFERENCES users(id));';
var t=C.parseDDL(ddl).value;
ok('tables', t.length===2);
ok('cols', t[0].cols.length===2 && t[0].cols[0].pk===true);
ok('fk', t[1].fks.length===1 && t[1].fks[0].to==='users');
ok('empty', C.parseDDL('no tables').value.length===0);
console.log((fail?'FAIL':'PASS')+' ErForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);