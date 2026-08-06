
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
function near(a,b,t){return Math.abs(a-b)<=(t||1e-2);}
ok('H2O', near(A.molarMass('H2O').mass, 18.015));
ok('C6H12O6', near(A.molarMass('C6H12O6').mass, 180.156));
ok('Ca(OH)2', near(A.molarMass('Ca(OH)2').mass, 74.093));
ok('Fe2(SO4)3', near(A.molarMass('Fe2(SO4)3').mass, 399.858));
ok('CuSO4.5H2O', near(A.molarMass('CuSO4.5H2O').mass, 249.686));
ok('CO2', near(A.molarMass('CO2').mass, 44.009));
ok('unknown', !!A.molarMass('XxC').error);
var r=A.molarMass('H2O'); ok('comp sum 100%', near(r.rows.reduce(function(s,x){return s+x.frac;},0),1,1e-6));
console.log('MolarMassForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
