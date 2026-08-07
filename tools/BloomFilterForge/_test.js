
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var b=A.makeBloom(2000,3);
ok('empty has false', b.has("x")===false);
b.add("apple"); b.add("banana"); b.add("cherry");
ok('added present (no false negative)', b.has("apple")&&b.has("banana")&&b.has("cherry"));
ok('absent likely false', b.has("zzz_nonexistent_xyz_123")===false);
console.log('BloomFilterForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
