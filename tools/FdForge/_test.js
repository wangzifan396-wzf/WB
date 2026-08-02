
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
var list='a/foo.js\nb/bar.py\nc/baz.js';
var r=C.filter(list,'\\.js$',{mode:'regex'}).value; ok('regex', r.length===2);
var r2=C.filter(list,'py',{mode:'substr'}).value; ok('sub', r2.length===1 && r2[0].indexOf('bar.py')>=0);
ok('bad', !!C.filter(list,'(',{mode:'regex'}).error);
var r3=C.filter(list,'baz.js',{mode:'exact'}).value; ok('exact', r3.length===1);
console.log((fail?'FAIL':'PASS')+' FdForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);