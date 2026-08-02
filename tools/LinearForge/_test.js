const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
function near(a,b,e){ return Math.abs(a-b)<=(e||1e-9); }
var perfect=[[1,3],[2,5],[3,7],[4,9]];
var f=A.linFit(perfect).value;
ok('slope 2', near(f.slope,2));
ok('intercept 1', near(f.intercept,1));
ok('perfect r2=1', near(f.r2,1));
ok('perfect r=1', near(f.r,1));
ok('predict', near(A.linPredict(f,10),21));
var noisy=[[1,2.1],[2,3.9],[3,6.2],[4,7.8],[5,10.1]];
var fn2=A.linFit(noisy).value;
ok('noisy slope near 2', Math.abs(fn2.slope-2)<0.1);
ok('noisy r2 high', fn2.r2>0.99);
ok('residuals sum ~0', near(A.linResiduals(fn2,noisy).reduce(function(a,b){return a+b;},0),0,1e-9));
ok('rmse small', A.linRmse(fn2,noisy)<0.2);
var neg=[[0,10],[1,8],[2,6],[3,4]];
var f3=A.linFit(neg).value;
ok('negative slope', near(f3.slope,-2));
ok('negative r=-1', near(f3.r,-1));
ok('too few points', A.linFit([[1,1]]).error!==null);
ok('same x error', A.linFit([[2,1],[2,5]]).error!==null);
var flat=[[1,5],[2,5],[3,5]];
var f4=A.linFit(flat).value;
ok('flat slope 0', near(f4.slope,0));
ok('flat r2=1', near(f4.r2,1));
var pr=A.linParse('1, 2\n3, 4');
ok('parse ok', pr.error===null && pr.value.length===2);
ok('parse bad line', A.linParse('1\n2,3').error!==null);
console.log('LinearForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
