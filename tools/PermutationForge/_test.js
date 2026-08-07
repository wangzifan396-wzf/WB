
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('nPr(10,3)=720', A.nPr(10,3)===720n);
ok('nPr(5,2)=20', A.nPr(5,2)===20n);
ok('nPr(10,0)=1', A.nPr(10,0)===1n);
ok('nPr(7,7)=5040', A.nPr(7,7)===5040n);
ok('nPr(5,6)=null', A.nPr(5,6)===null);
console.log('PermutationForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
