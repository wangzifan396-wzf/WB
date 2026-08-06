
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
function near(a,b,t){return Math.abs(a-b)<=(t||1e-6);}
ok('base',  near(A.water(70,0,false), 2310));
ok('ex',    near(A.water(70,60,false), 3310));
ok('hot',   near(A.water(70,60,true), 3810));
console.log('WaterIntakeForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
