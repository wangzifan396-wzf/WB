
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var p=A.make(4);
A.union(p,0,1); A.union(p,2,3);
ok('conn 0-1 true', A.connected(p,0,1)===true);
ok('conn 0-2 false', A.connected(p,0,2)===false);
A.union(p,1,3);
ok('conn 0-2 true after merge', A.connected(p,0,2)===true);
ok('conn 0-3 true', A.connected(p,0,3)===true);
ok('find root', A.find(p,2)===A.find(p,3));
console.log('UnionFindForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
