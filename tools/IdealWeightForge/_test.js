
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
function near(a,b,t){return Math.abs(a-b)<=(t||1e-4);}
var all=A.ibwAll('m',180);
ok('devine', near(all.devine, 74.99, 0.05));
ok('hamwi',  near(all.hamwi, 77.34, 0.05));
ok('robinson',near(all.robinson, 72.65, 0.05));
ok('miller',  near(all.miller, 71.52, 0.05));
var r=A.healthyRange(180);
ok('range lo', near(r.lo, 59.94, 0.01));
ok('range hi', near(r.hi, 80.68, 0.01));
console.log('IdealWeightForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
