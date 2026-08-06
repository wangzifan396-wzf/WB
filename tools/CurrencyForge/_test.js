
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
function near(a,b,t){return Math.abs(a-b)<=(t||1e-6);}
var R=A.DEFAULT_RATES;
ok('usd->cny', near(A.convert(100,'USD','CNY',R), 720));
ok('cny->usd', near(A.convert(720,'CNY','USD',R), 100));
ok('cross eur->jpy', near(A.convert(1,'EUR','JPY',R), 150/0.92, 1e-6));
ok('roundtrip', near(A.convert(A.convert(100,'USD','CNY',R),'CNY','USD',R), 100, 1e-9));
ok('missing', A.convert(100,'USD','XXX',R)===null);
console.log('CurrencyForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
