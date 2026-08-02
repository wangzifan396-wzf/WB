const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
const arr=[5,2,8,1,9,3,7,4];
const t=A.stBuild(arr).value;
ok('build ok', t!==null && t.n===8);
ok('build empty error', A.stBuild([]).error!==null);
ok('build NaN error', A.stBuild([1,NaN]).error!==null);
// queries
ok('sum full', A.stQuery(t,0,7,'sum').value===39);
ok('sum [1,5]', A.stQuery(t,1,5,'sum').value===23);
ok('min [1,5]', A.stQuery(t,1,5,'min').value===1);
ok('max [1,5]', A.stQuery(t,1,5,'max').value===9);
ok('single elem', A.stQuery(t,3,3,'sum').value===1);
ok('query oob', A.stQuery(t,0,8,'sum').error!==null);
ok('query bad kind', A.stQuery(t,0,1,'avg').error!==null);
// lazy update
A.stUpdate(t,2,4,10); // [5,2,18,11,19,3,7,4]
ok('after add sum full', A.stQuery(t,0,7,'sum').value===69);
ok('after add min [2,4]', A.stQuery(t,2,4,'min').value===11);
ok('after add max full', A.stQuery(t,0,7,'max').value===19);
ok('untouched region', A.stQuery(t,5,7,'sum').value===14);
// nested lazy: partial overlap forces push
A.stUpdate(t,0,3,-1); // [4,1,17,10,19,3,7,4]
ok('nested sum [0,2]', A.stQuery(t,0,2,'sum').value===22);
ok('nested min full', A.stQuery(t,0,7,'min').value===1);
ok('update oob', A.stUpdate(t,-1,2,5).error!==null);
console.log('SegmentForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
