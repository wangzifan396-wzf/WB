
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('mc', A.marketCap(2,1000)===2000);
ok('price', A.priceForCap(2000,1000)===2);
ok('val', A.valuation(10,2)===20);
ok('fdv', A.fdv(2,2000)===4000);
ok('err', !!A.marketCap(-1,1).error);
ok('err2', !!A.priceForCap(1,0).error);
console.log('MarketCapForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
