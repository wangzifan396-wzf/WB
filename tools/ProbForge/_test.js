
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
function near(a,b,t){return Math.abs(a-b)<=t;}
ok('normalCdf 0', near(A.normalCdf(0,0,1),0.5,1e-6));
ok('normalCdf 1.96', near(A.normalCdf(1.96,0,1),0.975,1e-3));
ok('normalPdf 0', near(A.normalPdf(0,0,1),0.3989,1e-3));
ok('binomPmf', near(A.binomialPmf(2,4,0.5),0.375,1e-9));
ok('binomCdf', near(A.binomialCdf(2,4,0.5),0.6875,1e-9));
ok('poisPmf', near(A.poissonPmf(0,1),0.367879,1e-4));
console.log('ProbForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
