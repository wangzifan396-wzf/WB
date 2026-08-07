
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r0=A.welchT([1,2,3],[1,2,3]);
ok('identical t=0', r0.t===0);
ok('identical p=1', Math.abs(r0.p-1)<1e-9);
var r1=A.welchT([1,2,3],[100,101,102]);
ok('huge diff p<0.001', r1.p<0.001);
ok('huge diff t large', Math.abs(r1.t)>50);
var r2=A.welchT([1,2,3,4],[2,3,4,5]);
ok('shift t~ -1.0954', Math.abs(r2.t+1.0954)<1e-3);
ok('shift p in (0.2,0.45)', r2.p>0.2 && r2.p<0.45);
console.log('TTestForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
