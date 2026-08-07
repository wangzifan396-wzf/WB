
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var sig=A.sine(10,64,64,1); var sp=A.dft(sig,64);
ok('dft length 32', sp.length===32);
ok('peak bin = 10 (10Hz@64/64)', A.peakBin(sp)===10);
ok('peak freq ~10', Math.abs(sp[A.peakBin(sp)].freq-10)<1e-9);
ok('sine length', sig.length===64);
console.log('SpectrumForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
