
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var t=A.makeBTree();
var ins=[10,20,5,6,12,30,7,17,3,1,9,25,28,13,14];
ins.forEach(function(x){t.insert(x);});
var io=t.inorder();
ok('inorder sorted', JSON.stringify(io)===JSON.stringify(ins.slice().sort(function(a,b){return a-b;})));
ok('search hit', t.search(t.root,12)===true);
ok('search miss', t.search(t.root,99)===false);
console.log('BTreeForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
