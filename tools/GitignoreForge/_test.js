
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('node', A.merge(["node"]).indexOf("node_modules/") >= 0);
ok('python', A.merge(["python"]).indexOf("__pycache__/") >= 0);
ok('multi', A.merge(["node","python"]).indexOf("node_modules/") >= 0 && A.merge(["node","python"]).indexOf("__pycache__/") >= 0);
ok('osx', A.merge(["osx"]).indexOf(".DS_Store") >= 0);
ok('empty', A.merge([]) === "");
ok('unknown', A.merge(["nope"]).indexOf("----") < 0);
console.log('GitignoreForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
