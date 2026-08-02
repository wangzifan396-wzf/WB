const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
const near=(a,b,eps)=>Math.abs(a-b)<(eps||1e-9);
ok('parse mixed', JSON.stringify(A.bfParse('1, 2\n3 4,x'))===JSON.stringify([1,2,3,4]));
ok('mean', A.bfMean([1,2,3,4,5])===3);
ok('median odd', A.bfMedian([5,1,3])===3);
ok('median even', A.bfMedian([1,2,3,4])===2.5);
ok('stddev sample', near(A.bfStddev([1,2,3,4,5]), Math.sqrt(2.5)));
ok('stddev single', A.bfStddev([7])===0);
ok('mad', A.bfMad([1,2,3,4,5])===1);
var s=A.bfStats([1,2,3,4,5]).value;
ok('stats pack', s.n===5 && s.min===1 && s.max===5 && s.median===3);
ok('stats p95', s.p95===5);
ok('stats empty error', A.bfStats([]).error!==null);
// outliers: modified z-score
var o=A.bfOutliers([12.1,11.8,12.3,12.0,11.9,12.2,30.5,12.1]).value;
ok('outlier found', o.outliers.length===1 && o.outliers[0]===30.5);
ok('outlier index', o.indexes[0]===6);
ok('no outlier clean', A.bfOutliers([10,10.1,9.9,10.05,9.95]).value.outliers.length===0);
ok('mad zero fallback', A.bfOutliers([1,1,1,1,100]).value.outliers[0]===100);
// compare
var c=A.bfCompare([2,2,2],[4,4,4]).value;
ok('compare faster A', c.faster==='A');
ok('compare ratio 2x', near(c.ratio,2));
ok('compare zero err', near(c.ratioErr,0));
var c2=A.bfCompare([4,4,4],[2,2,2]).value;
ok('compare faster B', c2.faster==='B' && near(c2.ratio,2));
ok('compare empty error', A.bfCompare([],[1]).error!==null);
console.log('BenchForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
