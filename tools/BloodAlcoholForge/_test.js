
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('alcoholGrams(350,5)=13.8075', Math.abs(A.alcoholGrams(350,5)-13.8075)<1e-6);
ok('alcoholGrams(500,40)=157.8', Math.abs(A.alcoholGrams(500,40)-157.8)<1e-6);
ok('bac male 0h ~0.029', Math.abs(A.bac(350,5,70,'M',0)-0.029009)<1e-4);
ok('bac clamp >=0', A.bac(10,5,70,'M',100)===0);
ok('bac female higher', A.bac(350,5,70,'F',0) > A.bac(350,5,70,'M',0));
ok('soberHours(0.09)=6', Math.abs(A.soberHours(0.09)-6)<1e-9);
console.log('BloodAlcoholForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
