
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('parse',JSON.stringify(A.parseCsv('a,b\n1,"x,y"'))===JSON.stringify([['a','b'],['1','x,y']]));
ok('mysql',A.csvToSql('id,name\n1,Alice', 't',{dialect:'mysql'})==="INSERT INTO t (id, name) VALUES (1, 'Alice');");
ok('quote',A.csvToSql("id,n\n1,O'Brien", 't',{dialect:'mysql'}).indexOf("O''Brien")>=0);
ok('pg',A.csvToSql('a,b\n1,2\n3,4','t',{dialect:'postgres'}).indexOf('VALUES (1, 2), (3, 4)')>=0);
ok('null',A.csvToSql('a,b\n1,', 't',{dialect:'mysql'}).indexOf('NULL')>=0);
console.log('CsvSqlForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
