
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var t=A.makeAVL();
[10,20,5,6,12,30,7,17,3].forEach(function(x){t.add(x);});
var io=t.list();
ok('inorder sorted', JSON.stringify(io)==='[3,5,6,7,10,12,17,20,30]');
ok('balanced height <=4', t.h()<=4);
ok('search via list', io.indexOf(17)>=0);
console.log('AvlTreeForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
