
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
function near(a,b,t){return Math.abs(a-b)<=(t||1e-6);}
ok('phToH 7', near(A.phToH(7),1e-7));
ok('hToPh 1e-7', near(A.hToPh(1e-7),7));
ok('poh 7', near(A.phToPoh(7),7));
ok('strong 0.01', near(A.strongAcidPh(0.01),2));
ok('weak 0.1/1.8e-5', near(A.weakAcidPh(0.1,1.8e-5),2.872,1e-3));
ok('weakH', near(A.weakAcidH(0.1,1.8e-5),1.3416e-3,1e-6));
console.log('PhForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
