
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
var r=C.gen({domain:'example.com', upstream:'localhost:8080'}).value;
ok('rp', r.indexOf('reverse_proxy localhost:8080')>=0);
ok('block', r.indexOf('example.com {')>=0);
ok('nodef', !!C.gen({}).error);
var r2=C.gen({domain:'a.com', tls:'off'}).value; ok('tls', r2.indexOf('tls off')>=0);
var r3=C.gen({domain:'a.com', fileRoot:'/var/www'}).value; ok('file', r3.indexOf('file_server')>=0);
console.log((fail?'FAIL':'PASS')+' CaddyForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);