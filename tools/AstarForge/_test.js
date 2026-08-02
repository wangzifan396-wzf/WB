const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
const J=JSON.stringify;
// parse
const p1=A.asParseGrid('S..\n.#.\n..E');
ok('parse ok', p1.error===null && p1.value.rows===3 && p1.value.cols===3);
ok('parse start end', J(p1.value.start)===J([0,0]) && J(p1.value.end)===J([2,2]));
ok('parse missing start', A.asParseGrid('...\n..E').error!==null);
ok('parse ragged', A.asParseGrid('S..\n.E').error!==null);
ok('parse bad char', A.asParseGrid('S?E').error!==null);
// path on 3x3 with center wall
const r1=A.asFindPath(p1.value);
ok('cost 4', r1.error===null && r1.value.cost===4);
ok('path len = cost+1', r1.value.path.length===5);
ok('path endpoints', J(r1.value.path[0])===J([0,0]) && J(r1.value.path[4])===J([2,2]));
ok('wall not in path', r1.value.path.every(p=>!(p[0]===1&&p[1]===1)));
// straight line
const p2=A.asParseGrid('S.E');
ok('straight cost 2', A.asFindPath(p2.value).value.cost===2);
// adjacent
ok('adjacent cost 1', A.asFindPath(A.asParseGrid('SE').value).value.cost===1);
// no path
const p3=A.asParseGrid('S#E');
ok('no path error', A.asFindPath(p3.value).error!==null);
// detour grid: wall row forces going around
const p4=A.asParseGrid('S....\n####.\n....E');
const r4=A.asFindPath(p4.value);
ok('detour cost 6', r4.error===null && r4.value.cost===6);
ok('expanded bounded', r4.value.expanded<=15);
console.log('AstarForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
