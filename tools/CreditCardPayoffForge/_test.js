
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r=A.payoff(1000,0.18,0.02,25);
ok('months', r.months>0 && typeof r.totalInterest==='number');
ok('paid', r.totalPaid>=1000);
ok('never', A.payoff(100000,0.2,0.001,0).months===-1);
ok('err', !!A.payoff(-1,0.18,0.02,0).error);
console.log('CreditCardPayoffForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
