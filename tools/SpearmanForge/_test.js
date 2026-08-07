
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('perfect +1', A.spearman([1,2,3,4],[1,2,3,4])===1);
ok('anti -1', A.spearman([1,2,3,4],[4,3,2,1])===-1);
ok('monotonic nonlinear +1', A.spearman([1,2,3,4,5],[1,4,9,16,25])===1);
console.log('SpearmanForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
