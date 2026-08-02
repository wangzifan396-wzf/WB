const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('parse ok', A.stParse('3,1,2').value.join(',')==='3,1,2');
ok('parse spaces + cjk comma', A.stParse('3 1，2').value.length===3);
ok('parse nan error', A.stParse('1,x').error!==null);
ok('parse single error', A.stParse('5').error!==null);
ok('parse empty error', A.stParse('').error!==null);
const IN=[7,3,9,1,5,8,2,6,4], EXP='1,2,3,4,5,6,7,8,9';
for(const alg of ['bubble','insertion','selection','quick','merge']){
  const r=A.stSort(IN, alg);
  ok(alg+' sorts', r.value.sorted.join(',')===EXP);
  ok(alg+' input untouched', IN.join(',')==='7,3,9,1,5,8,2,6,4');
  ok(alg+' counts positive', r.value.comparisons>0);
}
ok('unknown alg error', A.stSort([2,1],'bogo').error!==null);
// sorted input: bubble early-exits with n-1 comparisons
const rb=A.stSort([1,2,3,4,5],'bubble');
ok('bubble best case n-1 cmp', rb.value.comparisons===4 && rb.value.moves===0);
// selection always n(n-1)/2 comparisons
ok('selection fixed cmp', A.stSort([1,2,3,4,5],'selection').value.comparisons===10);
// duplicates + negatives
ok('dups ok', A.stSort([3,1,3,-2,1],'quick').value.sorted.join(',')==='-2,1,1,3,3');
ok('frames start with input', A.stSort([2,1],'merge').value.frames[0].join(',')==='2,1');
ok('isSorted true', A.stIsSorted([1,1,2])===true);
ok('isSorted false', A.stIsSorted([2,1])===false);
const c=A.stCompare([5,4,3,2,1]);
ok('compare 5 algs', c.length===5);
ok('compare has fields', c.every(x=>typeof x.comparisons==='number' && typeof x.moves==='number'));
ok('svg renders', A.stSvg([[3,1,2],[1,2,3]]).indexOf('<svg')===0);
console.log('SortForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
