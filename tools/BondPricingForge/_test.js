
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('par', (function(){var r=A.bondPrice(1000,0.05,0.05,10,2); return Math.abs(r.price-1000)<1;})());
ok('premium', A.bondPrice(1000,0.06,0.05,10,2).price>1000);
ok('discount', A.bondPrice(1000,0.04,0.05,10,2).price<1000);
console.log('BondPricingForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
