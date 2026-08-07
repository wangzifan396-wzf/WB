
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var j=A.csvToJson('a,b\n1,2');
ok('simple', j.length===1 && j[0].a==='1' && j[0].b==='2');
var q=A.csvToJson('a,b\n"x,y","p""q"');
ok('quoted comma', q[0].a==='x,y');
ok('escaped quote', q[0].b==='p"q');
var back=A.jsonToCsv([{a:'1',b:'2'}]);
ok('json->csv', back==='a,b\n1,2');
ok('roundtrip quoted', A.jsonToCsv(A.csvToJson('a,b\n"x,y",z'))==='a,b\n"x,y",z');
console.log('CsvToJsonForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
