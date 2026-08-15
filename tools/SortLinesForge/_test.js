
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('asc', A.sort('banana\napple', false, false, false, false)==='apple\nbanana');
ok('desc', A.sort('apple\nbanana', true, false, false, false)==='banana\napple');
ok('unique', A.sort('b\na\nb', false, false, false, true)==='a\nb');
ok('ignorecase', A.sort('Banana\napple', false, true, false, false)==='apple\nBanana');
console.log('SortLinesForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
