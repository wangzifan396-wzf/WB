
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('KE 1e15/phi2 ~2.136eV', Math.abs(A.maxKEev(1e15,2)-2.13566)<1e-3);
ok('threshold phi2 ~4.835e14', Math.abs(A.threshold(2)-4.83598e14)<1e9);
ok('no emission ->0', A.stoppingV(1e14,2)===0);
console.log('PhotoelectricForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
