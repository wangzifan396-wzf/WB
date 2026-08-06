
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
function near(a,b,t){return Math.abs(a-b)<=(t||1e-3);}
var r=A.ideal(1,22.414,null,273.15); ok('ideal n', near(r.n,1.0));
ok('ideal P', near(A.ideal(null,10,1,300).P, 2.467, 1e-2));
ok('ideal V', near(A.ideal(1,null,1,273.15).V, 22.414, 1e-2));
ok('ideal T', near(A.ideal(1,22.414,1,null).T, 273.15, 1e-1));
var c=A.combined(1,2,300,null,1,300); ok('combined P2', near(c.P2,2));
ok('combined V2', near(A.combined(1,2,300,2,null,300).V2,1));
ok('combined V1', near(A.combined(1,null,300,2,1,300).V1,2,1e-6));
ok('combined T1', near(A.combined(1,2,null,2,1,300).T1,300,1e-6));
ok('combined T2', near(A.combined(1,2,300,2,1,null).T2,300,1e-6));
console.log('GasLawForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
