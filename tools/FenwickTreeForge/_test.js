
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var bit=A.fenwickBuild([1,2,3,4,5]);
ok('prefix 3 =6', A.fenwickQuery(bit,3)===6);
ok('range 2..4 =9', A.fenwickRange(bit,2,4)===9);
A.fenwickAdd(bit,3,10);
ok('after add prefix3 =16', A.fenwickQuery(bit,3)===16);
ok('after add range2..4 =19', A.fenwickRange(bit,2,4)===19);
console.log('FenwickTreeForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
