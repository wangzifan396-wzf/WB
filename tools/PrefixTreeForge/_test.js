
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var tr=A.makeTrie();
["cat","car","dog","cart"].forEach(function(x){tr.insert(x);});
ok('search car true', tr.search("car")===true);
ok('search ca false', tr.search("ca")===false);
ok('startsWith ca true', tr.startsWith("ca")===true);
ok('startsWith doz false', tr.startsWith("doz")===false);
console.log('PrefixTreeForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
