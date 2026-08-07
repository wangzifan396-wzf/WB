
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var st=A.build([1,2,3,4,5]);
ok('full sum 15', A.query(st,0,4)===15);
ok('partial sum 9', A.query(st,1,3)===9);
A.update(st,2,10);
ok('after update full 22', A.query(st,0,4)===22);
ok('after update partial 16', A.query(st,1,3)===16);
console.log('SegmentTreeForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
