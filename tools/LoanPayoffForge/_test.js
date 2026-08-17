
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var z=A.loanPayoff(100000,5,60,0); ok('equal', z.interestSaved===0 && z.standardMonths===60 && z.acceleratedMonths===60);
var x=A.loanPayoff(100000,5,60,200); ok('save', x.monthsSaved>0 && x.interestSaved>0);
ok('zero', A.loanPayoff(100000,0,60,0).interestSaved===0);
ok('err', !!A.loanPayoff(0,5,60).error);
console.log('LoanPayoffForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
