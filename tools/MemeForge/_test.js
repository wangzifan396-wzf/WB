
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('wrap1', JSON.stringify(A.wrapLines("hello world foo", 5)) === JSON.stringify(["hello","world","foo"]));
ok('wrap2', JSON.stringify(A.wrapLines("a", 3)) === JSON.stringify(["a"]));
ok('wrap long', A.wrapLines("super long word here people", 8).length >= 2);
console.log('MemeForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
