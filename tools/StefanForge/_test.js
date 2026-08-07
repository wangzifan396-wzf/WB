
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('radiance(300)~459.3', Math.abs(A.radiance(300)-459.3)<1e-2);
ok('power(300,2)~918.6', Math.abs(A.power(300,2)-918.6)<1e-2);
ok('radiance(0)=0', A.radiance(0)===0);
console.log('StefanForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
