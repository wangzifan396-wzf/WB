
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
function near(a,b,t){return Math.abs(a-b)<=(t||1e-6);}
var r1=A.limiting("N2 + 3 H2 -> 2 NH3", {N2:1,H2:3}, "NH3");
ok('lim N2=H2', r1.limiting==="N2"||r1.limiting==="H2"); ok('theo 2', near(r1.theoretical,2));
var r2=A.limiting("N2 + 3 H2 -> 2 NH3", {N2:1,H2:1}, "NH3");
ok('lim H2', r2.limiting==="H2"); ok('theo 0.667', near(r2.theoretical,2/3));
ok('yield 80%', near(A.percentYield(1.6,2),80));
ok('bad target', !!A.limiting("N2 + 3 H2 -> 2 NH3",{N2:1,H2:3},"Xx").error);
console.log('YieldForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
