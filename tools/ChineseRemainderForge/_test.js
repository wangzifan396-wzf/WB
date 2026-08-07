
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r=A.crt([2,3,2],[3,5,7]); ok('classic x=23 mod105', r && r.x===23 && r.mod===105);
var r2=A.crt([1,2],[2,3]); ok('x=5 mod6', r2 && r2.x===5 && r2.mod===6);
var r3=A.crt([1,2],[2,4]); ok('inconsistent null', r3===null);
console.log('ChineseRemainderForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
