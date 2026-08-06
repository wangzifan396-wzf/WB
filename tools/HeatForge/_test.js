
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
function near(a,b,t){return Math.abs(a-b)<=(t||1e-6);}
ok('heat', near(A.heat(1,4186,10),41860));
ok('phase', near(A.phase(0.1,334000),33400));
ok('mix', near(A.mixTemp(1,4186,100,1,4186,0),50));
ok('mix uneven', near(A.mixTemp(2,4186,100,1,4186,0),66.6666667,1e-4));
console.log('HeatForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
