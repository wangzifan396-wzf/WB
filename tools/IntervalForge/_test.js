const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
const J=JSON.stringify;
// parse
ok('parse comma', J(A.ivParse('1,3\n2,6').value)===J([[1,3],[2,6]]));
ok('parse dash', J(A.ivParse('1-3').value)===J([[1,3]]));
ok('parse reversed error', A.ivParse('5,2').error!==null);
ok('parse bad error', A.ivParse('a,b').error!==null);
// merge (LeetCode 56 classic)
ok('merge classic', J(A.ivMerge([[1,3],[2,6],[8,10],[15,18]]).value)===J([[1,6],[8,10],[15,18]]));
ok('merge touching', J(A.ivMerge([[1,4],[4,5]]).value)===J([[1,5]]));
ok('merge nested', J(A.ivMerge([[1,10],[2,3]]).value)===J([[1,10]]));
ok('merge unsorted input', J(A.ivMerge([[8,10],[1,3],[2,6]]).value)===J([[1,6],[8,10]]));
ok('merge empty', J(A.ivMerge([]).value)===J([]));
// intersect
ok('intersect', J(A.ivIntersect([1,5],[3,8]))===J([3,5]));
ok('intersect none', A.ivIntersect([1,2],[3,4])===null);
ok('intersect point', J(A.ivIntersect([1,3],[3,5]))===J([3,3]));
// schedule (activity selection)
const s=A.ivSchedule([[1,3],[2,6],[8,10],[15,18],[9,12]]);
ok('schedule count 3', s.value.count===3);
ok('schedule greedy earliest end', s.value.picked[0][1]===3);
ok('schedule empty', A.ivSchedule([]).value.count===0);
// rooms (LeetCode 253)
ok('rooms 2', A.ivRooms([[0,30],[5,10],[15,20]]).value===2);
ok('rooms 1 back-to-back', A.ivRooms([[7,10],[2,4]]).value===1);
ok('rooms touching reuse', A.ivRooms([[1,5],[5,10]]).value===1);
ok('rooms 3 overlap', A.ivRooms([[1,10],[2,7],[3,19]]).value===3);
// gaps
ok('gaps', J(A.ivGaps([[1,3],[2,6],[8,10]]).value)===J([[6,8]]));
ok('gaps none', J(A.ivGaps([[1,5],[2,6]]).value)===J([]));
console.log('IntervalForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
