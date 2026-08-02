
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
var t='aws_key = AKIAIOSFODNN7EXAMPLE\ntoken = "ghp_1234567890abcdefghijklmnopqrstuvwxyz"\nfoo = bar\npassword = "s3cr3tP@ss"';
var r=C.scan(t).value; ok('found', r.length>=3);
ok('aws', r.some(function(f){return f.type==='AWS Key';}));
ok('pw', r.some(function(f){return f.type==='Password Assign';}));
ok('clean', C.scan('just normal code here').value.length===0);
console.log((fail?'FAIL':'PASS')+' GitleaksForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);