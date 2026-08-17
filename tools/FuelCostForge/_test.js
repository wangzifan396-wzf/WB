
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var s=A.fuelCost(200,8,7.5,false);
ok('liters', Math.abs(s.liters-16)<1e-9);
ok('cost', Math.abs(s.cost-120)<1e-9);
var r=A.fuelCost(200,8,7.5,true);
ok('rt', Math.abs(r.liters-32)<1e-9 && Math.abs(r.cost-240)<1e-9);
ok('err', !!A.fuelCost(0,8,7.5).error);
console.log('FuelCostForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
