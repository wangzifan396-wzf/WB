const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
function near(a,b){ return Math.abs(a-b)<1e-9; }
var d=[1,2,3,4,5,6,7,8,9,10];
ok('p50 linear interp', near(A.percentile(d,50),5.5));
ok('p0 min', near(A.percentile(d,0),1));
ok('p100 max', near(A.percentile(d,100),10));
ok('p90', near(A.percentile(d,90),9.1));
ok('single element', near(A.percentile([42],99),42));
ok('unsorted input', near(A.percentile([3,1,2],50),2));
var t=false; try{ A.percentile([],50); }catch(e){ t=(e.message==='EMPTY'); }
ok('empty throws', t);
var t2=false; try{ A.percentile(d,101); }catch(e){ t2=(e.message==='P_RANGE'); }
ok('p range throws', t2);
ok('mean', near(A.mean([2,4,6]),4));
ok('stddev sample', near(A.stddev([2,4,4,4,5,5,7,9]),2.138089935299395));
var s=A.summary(d);
ok('summary fields', s.count===10 && s.min===1 && s.max===10 && near(s.p50,5.5));
var h=A.histogram([0,1,2,3,4,5,6,7],4);
ok('histogram buckets', h.length===4 && h.reduce((a,b)=>a+b.count,0)===8 && h[3].count===2);
console.log('PercentileForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
