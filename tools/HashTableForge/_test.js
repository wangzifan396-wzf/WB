
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('hash("test",10)=8', A.hash('test',10)===8);
ok('hash deterministic', A.hash('abc',100)===A.hash('abc',100));
var b=A.buckets(['a','b','c'],4);
ok('buckets total keys=3', Object.keys(b).reduce(function(s,k){return s+b[k].length;},0)===3);
ok('buckets missing-key none', A.buckets(['x'],3)['x'.length? A.hash('x',3):0]!==undefined);
console.log('HashTableForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
