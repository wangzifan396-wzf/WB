
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('rank [0,1,2]=0', A.rank([0,1,2])===0);
ok('rank [2,1,0]=5', A.rank([2,1,0])===5);
var u=A.unrank(3,5); ok('unrank 3,5=[2,1,0]', u[0]===2&&u[1]===1&&u[2]===0);
ok('roundtrip 4,10', A.rank(A.unrank(4,10))===10);
console.log('PermutationRankForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
