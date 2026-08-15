
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('fv lump', A.futureValue(1000,0,0,5,1)===1000);
ok('fv pmt', A.futureValue(0,100,0,1,12)===1200);
ok('fv rate', Math.abs(A.futureValue(1000,0,0.1,1,1)-1100)<0.01);
ok('table', A.growthTable(0,100,0,2,12).length===2);
console.log('InvestmentForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
