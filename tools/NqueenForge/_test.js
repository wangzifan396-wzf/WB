const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
// classic counts: 1,0,0,2,10,4,40,92
ok('n=1 one solution', A.nqSolve(1).value.total===1);
ok('n=2 no solution', A.nqSolve(2).value.total===0);
ok('n=3 no solution', A.nqSolve(3).value.total===0);
ok('n=4 two solutions', A.nqSolve(4).value.total===2);
ok('n=5 ten solutions', A.nqSolve(5).value.total===10);
ok('n=6 four solutions', A.nqSolve(6).value.total===4);
ok('n=8 ninety-two', A.nqSolve(8).value.total===92);
ok('n bad error', A.nqSolve(0).error!==null && A.nqSolve(3.5).error!==null && A.nqSolve(99).error!==null);
// solutions validity
const s4=A.nqSolve(4);
ok('n=4 sols stored', s4.value.solutions.length===2);
ok('n=4 sols valid', s4.value.solutions.every(A.nqValidate));
ok('n=4 known sol', JSON.stringify(s4.value.solutions).indexOf('[1,3,0,2]')>-1);
ok('n=8 all 92 valid', A.nqSolve(8).value.solutions.every(A.nqValidate));
// limit
ok('limit caps storage', A.nqSolve(8, 5).value.solutions.length===5);
ok('limit keeps total', A.nqSolve(8, 5).value.total===92);
// validate
ok('validate good', A.nqValidate([1,3,0,2])===true);
ok('validate col clash', A.nqValidate([0,0,2,3])===false);
ok('validate diag clash', A.nqValidate([0,1,4,2])===false);
ok('validate bad input', A.nqValidate([])===false && A.nqValidate([5,0,1,2])===false);
// counts table
const c=A.nqCounts(6);
ok('counts table', c.map(x=>x.count).join(',')==='1,0,0,2,10,4');
// svg
const svg=A.nqSvg([1,3,0,2]);
ok('svg renders', svg.indexOf('<svg')===0);
ok('svg 4 queens', (svg.match(/circle/g)||[]).length===4);
console.log('NqueenForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
