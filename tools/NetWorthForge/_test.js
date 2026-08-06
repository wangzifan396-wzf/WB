
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
function near(a,b,t){return Math.abs(a-b)<=(t||1e-9);}
ok('net', near(A.netWorth([100,200],[50]).net, 250));
ok('assets', near(A.netWorth([100,200],[50]).assets, 300));
ok('parse', JSON.stringify(A.parseNums("1,2\n3"))===JSON.stringify([1,2,3]));
ok('empty liab', near(A.netWorth([10],[]).net, 10));
console.log('NetWorthForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
