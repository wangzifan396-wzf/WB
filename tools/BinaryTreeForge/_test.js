
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var t=[1,2,3,null,4];
ok('preorder 1,2,4,3', JSON.stringify(A.preorder(t))==='[1,2,4,3]');
ok('inorder 2,4,1,3', JSON.stringify(A.inorder(t))==='[2,4,1,3]');
ok('postorder 4,2,3,1', JSON.stringify(A.postorder(t))==='[4,2,3,1]');
ok('single root', JSON.stringify(A.inorder([7]))==='[7]');
console.log('BinaryTreeForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
