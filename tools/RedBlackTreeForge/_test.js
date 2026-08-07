
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var t=A.makeRBTree();
[10,20,5,15,30,25,1,2,7,17,3].forEach(function(x){t.insert(x);});
var io=t.inorder();
var sorted=[1,2,3,5,7,10,15,17,20,25,30];
ok('inorder sorted', JSON.stringify(io)===JSON.stringify(sorted));
ok('search hit', t.search(15)===true);
ok('search miss', t.search(99)===false);
ok('dup insert false', t.insert(10)===false);
console.log('RedBlackTreeForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
