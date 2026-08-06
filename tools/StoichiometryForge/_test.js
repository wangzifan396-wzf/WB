
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
function near(a,b,t){return Math.abs(a-b)<=(t||1e-6);}
var r=A.compute("2 H2 + O2 -> 2 H2O","H2",4);
ok('H2O from H2', near(r.out["H2O"],4));
ok('O2 from H2', near(r.out["O2"],2));
var r2=A.compute("N2 + 3 H2 -> 2 NH3","H2",3);
ok('NH3 from H2', near(r2.out["NH3"],2));
ok('N2 from H2', near(r2.out["N2"],1));
ok('bad formula', !!A.compute("2 H2 + O2 -> 2 H2O","Xx",1).error);
console.log('StoichiometryForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
