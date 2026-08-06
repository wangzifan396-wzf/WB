
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('dedup', JSON.stringify(A.dedupLines("a\na\nb")) === JSON.stringify(["a","b"]));
ok('dedup ic', JSON.stringify(A.dedupLines("A\na", {ignoreCase:true})) === JSON.stringify(["A"]));
ok('diff', JSON.stringify(A.difference("1\n2","2")) === JSON.stringify(["1"]));
ok('inter', JSON.stringify(A.intersection("1\n2","2\n3")) === JSON.stringify(["2"]));
ok('trim', JSON.stringify(A.dedupLines(" a \n a ", {trim:true})) === JSON.stringify(["a"]));
ok('blank', JSON.stringify(A.dedupLines("x\n\nx", {removeBlank:true})) === JSON.stringify(["x"]));
ok('sort', JSON.stringify(A.dedupLines("b\na", {sort:true})) === JSON.stringify(["a","b"]));
ok('count', A.count("a\n\nb\n") === 2);
console.log('DedupForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
