
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
var text='GET https://a.com\nHTTP/1.1 200\n\nPOST https://a.com/x\n{ "a": 1 }\nbody contains "ok"';
var e=C.parse(text).value;
ok('entries', e.length===2);
ok('m0', e[0].method==='GET' && e[0].url==='https://a.com');
ok('assert', e[1].asserts.length===1 && e[1].asserts[0].kind==='body');
ok('empty', C.parse('').value.length===0);
console.log((fail?'FAIL':'PASS')+' HurlForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);