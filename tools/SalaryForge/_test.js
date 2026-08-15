
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r=A.netSalary(10000,0,A.DEFAULT_BR);
ok('tax', Math.abs(r.tax-790)<0.01);
ok('net', Math.abs(r.net-9210)<0.01);
var r2=A.netSalary(2000,0,A.DEFAULT_BR); ok('lowtax', Math.abs(r2.tax-60)<0.01);
console.log('SalaryForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
