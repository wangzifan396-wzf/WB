
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
function coeffs(eq){ return A.balance(eq).coeffs; }
var a=coeffs("H2 + O2 -> H2O"); ok('H2O2', JSON.stringify(a)===JSON.stringify([2,1,2]));
var b=coeffs("C2H6 + O2 -> CO2 + H2O"); ok('combustion', JSON.stringify(b)===JSON.stringify([2,7,4,6]));
var c=coeffs("Fe + O2 -> Fe2O3"); ok('Fe', JSON.stringify(c)===JSON.stringify([4,3,2]));
var d=coeffs("KMnO4 + HCl -> KCl + MnCl2 + H2O + Cl2"); ok('redox', JSON.stringify(d)===JSON.stringify([2,16,2,2,8,5]));
var e=coeffs("Cu + HNO3 -> Cu(NO3)2 + NO + H2O"); ok('nitric', JSON.stringify(e)===JSON.stringify([3,8,3,2,4]));
console.log('EquationBalancerForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
