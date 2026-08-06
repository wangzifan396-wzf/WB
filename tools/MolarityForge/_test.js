
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
function near(a,b,t){return Math.abs(a-b)<=(t||1e-6);}
ok('molarity NaCl', near(A.molarity(58.44,58.44,1),1));
ok('massNeeded', near(A.massNeeded(1,58.44,0.5),29.22,1e-6));
ok('dilution', near(A.dilution(1,10,0.1),100));
ok('molality', near(A.molality(58.44,58.44,1),1));
console.log('MolarityForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
