
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('p(0)=1', A.partition(0)===1);
ok('p(3)=3', A.partition(3)===3);
ok('p(4)=5', A.partition(4)===5);
ok('p(5)=7', A.partition(5)===7);
ok('p(10)=42', A.partition(10)===42);
console.log('PartitionForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
