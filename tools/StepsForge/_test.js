
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
function near(a,b,t){return Math.abs(a-b)<=(t||1e-2);}
ok('stride', near(A.strideM(170), 0.7055, 1e-4));
ok('dist',   near(A.distanceKm(10000,170), 7.055, 1e-3));
ok('cal',    near(A.calories(7.055,70), 444.465, 0.5));
console.log('StepsForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
