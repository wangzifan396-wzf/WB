
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('zero', A.haversine(0,0,0,0)===0);
ok('quarter ~10007', Math.abs(A.haversine(0,0,0,90)-10007.5)<5);
ok('London-Paris ~343', Math.abs(A.haversine(51.5074,-0.1278,48.8566,2.3522)-343)<5);
console.log('HaversineForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
