
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
function near(a,b,t){return Math.abs(a-b)<=(t||1e-9);}
ok('density', near(A.density(10,2),5));
ok('mass', near(A.mass(5,2),10));
ok('volume', near(A.volume(10,5),2));
ok('sg', near(A.specificGravity(2000),2));
ok('div0', A.density(10,0)===null);
console.log('DensityForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
