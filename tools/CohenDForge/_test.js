
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r0=A.cohenD([1,2,3,4,5],[1,2,3,4,5]);
ok('identical d=0', r0===0);
var r1=A.cohenD([10,20,30],[11,21,31]);
ok('shift d=-0.1', Math.abs(r1+0.1)<1e-9);
console.log('CohenDForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
