
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('bufferPH(4.76,0.1,0.1)=4.76', Math.abs(A.bufferPH(4.76,0.1,0.1)-4.76)<1e-9);
ok('bufferPH(4.76,0.2,0.1)=4.459', Math.abs(A.bufferPH(4.76,0.2,0.1)-4.45897)<1e-3);
ok('neededBase 50:50', Math.abs(A.neededBase(4.76,0.1,4.76)-0.1)<1e-9);
ok('bufferPHmoles(4.76,1,2)', Math.abs(A.bufferPHmoles(4.76,1,2)-(4.76+Math.log10(2)))<1e-9);
console.log('BufferForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
