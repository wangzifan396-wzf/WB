
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var sql='CREATE TABLE users (\n  id INT PRIMARY KEY,\n  name VARCHAR(50)\n);\nCREATE TABLE orders (\n  id INT PRIMARY KEY,\n  user_id INT,\n  FOREIGN KEY (user_id) REFERENCES users(id)\n);';
var r=A.toMermaid(sql);
ok('count', r.tableCount===2);
ok('header', r.code.indexOf('erDiagram')===0);
ok('fields', r.code.indexOf('INT id')>=0 && r.code.indexOf('VARCHAR(50) name')>=0);
ok('fk', r.code.indexOf('orders ||--o{ users')>=0);
ok('parse', A.parseTables(sql).length===2 && A.parseTables(sql)[0].fields.length===2);
ok('empty', A.toMermaid('').tableCount===0);
console.log('SqlToErForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
