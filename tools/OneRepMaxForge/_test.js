
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('epley(100,5)~116.667', Math.abs(A.epley(100,5)-116.6667)<1e-3);
ok('brzycki(100,5)~112.51', Math.abs(A.brzycki(100,5)-112.51)<1e-2);
ok('lander(100,5)~114.68', Math.abs(A.lander(100,5)-114.68)<1e-2);
ok('oconner(100,5)=112.5', Math.abs(A.oconner(100,5)-112.5)<1e-9);
ok('lombardi(100,5)~117.46', Math.abs(A.lombardi(100,5)-117.46)<1e-2);
ok('allMethods keys', Object.keys(A.allMethods(100,5)).length===5);
console.log('OneRepMaxForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
