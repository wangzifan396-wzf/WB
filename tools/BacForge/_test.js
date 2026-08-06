
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
function near(a,b,t){return Math.abs(a-b)<=(t||1e-4);}
ok('alcoholG', near(A.alcoholG(350,0.05), 13.8075, 1e-4));
ok('bac', near(A.bac('m',80,350,0.05,0), 0.025382, 1e-4));
ok('sober', near(A.soberHours('m',80,350,0.05,0), 1.692, 1e-2));
console.log('BacForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
