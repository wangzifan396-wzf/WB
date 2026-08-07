
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('0.5,0.5 ->1', Math.abs(A.entropy([0.5,0.5])-1)<1e-9);
ok('certain ->0', A.entropy([1])===0);
ok('counts 1,1 ->1', Math.abs(A.entropyFromCounts([1,1])-1)<1e-9);
ok('four eq ->2', Math.abs(A.entropy([0.25,0.25,0.25,0.25])-2)<1e-9);
console.log('ShannonForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
