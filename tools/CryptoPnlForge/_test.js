
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
function near(a,b,t){return Math.abs(a-b)<=(t||1e-6);}
var lots=[{qty:1,price:100},{qty:1,price:200}];
var p=A.portfolio(lots);
ok('avg', near(p.avg, 150));
ok('cost', near(p.cost, 300));
var r=A.pnl(lots, 250);
ok('mv', near(r.marketValue, 500));
ok('pnl', near(r.pnl, 200));
ok('pnlPct', near(r.pnlPct, 200/3, 1e-6));
console.log('CryptoPnlForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
