
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('derange(0)=1', A.derange(0n)===1n);
ok('derange(1)=0', A.derange(1n)===0n);
ok('derange(2)=1', A.derange(2n)===1n);
ok('derange(3)=2', A.derange(3n)===2n);
ok('derange(4)=9', A.derange(4n)===9n);
console.log('DerangementForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
