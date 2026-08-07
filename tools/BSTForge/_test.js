
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r=A.build([5,3,8,1,4,7,9]); var io=[]; A.inorder(r,io);
ok('inorder sorted', JSON.stringify(io)==='[1,3,4,5,7,8,9]');
ok('search hit', A.search(r,7)===true);
ok('search miss', A.search(r,2)===false);
ok('min', A.minv(r)===1); ok('max', A.maxv(r)===9);
var r2=A.remove(r,3); var io2=[]; A.inorder(r2,io2);
ok('remove 3', JSON.stringify(io2)==='[1,4,5,7,8,9]');
console.log('BSTForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
