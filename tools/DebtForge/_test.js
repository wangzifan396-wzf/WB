
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('zero',A.monthsToPayoff(1000,0,100)===10);
var s0=A.schedule(1000,0,100);ok('sch0',s0.length===10 && A.totalInterest(1000,0,100)===0);
var mo=A.monthsToPayoff(1000,0.12,100);ok('pos',isFinite(mo) && mo>10);
var s=A.schedule(1000,0.12,100);ok('schlen',s.length===mo);
var sumP=0,sumI=0;for(var i=0;i<s.length;i++){sumP+=s[i].principal;sumI+=s[i].interest;}
ok('sumP',Math.abs(sumP-1000)<1e-6);
ok('sumI',Math.abs(sumI-A.totalInterest(1000,0.12,100))<1e-6);
ok('never',A.monthsToPayoff(1000,0.12,1)===Infinity);
console.log('DebtForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
