
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var sl=A.makeSkipList();
[5,3,8,1,2,7].forEach(function(x){sl.insert(x);});
var s=sl.toSorted();
ok('sorted', JSON.stringify(s)==='[1,2,3,5,7,8]');
ok('search hit', sl.search(3)===true);
ok('search miss', !sl.search(99));
ok('dup insert false', sl.insert(3)===false);
console.log('SkipListForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
