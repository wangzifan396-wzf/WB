
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('pi 1M@273.15 ~22.414', Math.abs(A.osmoticPressure(1,1,273.15)-22.414)<0.01);
ok('freezing 1m =1.86', Math.abs(A.freezingDepression(1,1,A.KF_WATER)-1.86)<1e-9);
ok('i=2 pi doubles', Math.abs(A.osmoticPressure(2,1,273.15)-44.828)<0.01);
console.log('OsmosisForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
