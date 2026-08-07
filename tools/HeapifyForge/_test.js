
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var h=A.heapify([5,3,8,1,2]); ok('heap root min', h[0]===1);
var s=[]; var x; while((x=A.pop(h))!==null) s.push(x);
ok('pop sorted', JSON.stringify(s)==='[1,2,3,5,8]');
var h2=A.heapify([4,4,4]); A.push(h2,1); ok('push then min', A.pop(h2)===1);
console.log('HeapifyForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
