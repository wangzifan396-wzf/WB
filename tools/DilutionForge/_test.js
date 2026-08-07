
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('dilution solve c2', Math.abs(A.dilution(10,100,null,500)-2)<1e-9);
ok('dilution solve v2', Math.abs(A.dilution(10,100,2,null)-500)<1e-9);
ok('dilution solve c1', Math.abs(A.dilution(null,100,2,500)-10)<1e-9);
ok('dilution solve v1', Math.abs(A.dilution(10,null,2,500)-100)<1e-9);
console.log('DilutionForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
