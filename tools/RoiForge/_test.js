
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
function near(a,b,t){return Math.abs(a-b)<=(t||1e-6);}
ok('roi 50%', near(A.roi(100,150),50));
ok('cagr 1y', near(A.cagr(100,200,1),1.0));
ok('cagr 2y', near(A.cagr(100,200,2),0.41421356,1e-5));
ok('multiple', near(A.multiple(100,250),2.5));
ok('roi zero init', A.roi(0,150)===null);
ok('series', JSON.stringify(A.totalReturnSeries([100,120,150]))===JSON.stringify([0,20,50]));
console.log('RoiForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
