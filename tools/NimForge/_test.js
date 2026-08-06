
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('sum', A.nimSum([3,4,5])===2);
ok('winning', A.nimWinning([3,4,5])===true);
ok('not winning', A.nimWinning([1,1])===false);
var mp=A.nimApply([3,4,5], A.nimBest([3,4,5]).pile, A.nimBest([3,4,5]).take);
ok('best makes zero', A.nimSum(mp)===0);
ok('null when losing', A.nimBest([2,2])===null);
console.log('NimForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
