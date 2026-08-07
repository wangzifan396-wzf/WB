
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('deltaH simple =6', Math.abs(A.deltaH([[2,1],[3,2]], [[1,1],[1,1]])-6)<1e-9);
ok('deltaH water formation', Math.abs(A.deltaH([[-285.8,1],[0,1]], [[0,1],[0,1]])+285.8)<1e-9);
ok('deltaH zero', A.deltaH([[1,1]], [[1,1]])===0);
console.log('EnthalpyForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
