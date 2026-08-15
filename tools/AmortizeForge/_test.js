
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('pmt0',A.monthlyPayment(12000,0,12)===1000);
ok('pmt',Math.abs(A.monthlyPayment(100000,0.06,12)-8607)<2);
var s=A.schedule(1000,0,3,'equal');
ok('schLen',s.length===3);
ok('schBal',s[2].balance===0);
var sumP=0;for(var i=0;i<s.length;i++)sumP+=s[i].principal;ok('schSum',Math.abs(sumP-1000)<1e-6);
var sp=A.schedule(12000,0.12,12,'principal');
ok('prinDec',sp[0].payment>sp[11].payment);
console.log('AmortizeForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
