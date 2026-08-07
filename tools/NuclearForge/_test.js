
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('lambda t12=1 ~0.693', Math.abs(A.decayConstant(1)-0.693147)<1e-5);
ok('remaining half', Math.abs(A.remaining(100,Math.log(2),1)-50)<1e-9);
ok('activity', Math.abs(A.activity(0.1,100)-10)<1e-9);
ok('decayed half', Math.abs(A.decayed(100,Math.log(2),1)-50)<1e-9);
console.log('NuclearForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
