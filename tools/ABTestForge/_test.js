
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r=A.twoPropZ(20,200,10,200);
ok('p1 0.1', Math.abs(r.p1-0.1)<1e-9);
ok('p2 0.05', Math.abs(r.p2-0.05)<1e-9);
ok('z>0', r.z>0);
ok('p in (0,1]', r.p>0&&r.p<=1);
ok('equal p~1', Math.abs(A.twoPropZ(100,200,100,200).p-1)<1e-6);
console.log('ABTestForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
