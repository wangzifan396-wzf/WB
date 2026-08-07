
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r=A.signedRank([1,2,3,4,5],3);
ok('Wplus=5', Math.abs(r.Wplus-5)<1e-9);
ok('Wminus=5', Math.abs(r.Wminus-5)<1e-9);
ok('W=5', r.W===5);
ok('n=4', r.n===4);
console.log('WilcoxonForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
