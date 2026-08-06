
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('start safe', A.rcSafe(['farmer','wolf','goat','cabbage'],[])===true);
ok('unsafe wolf+goat', A.rcSafe(['wolf','goat'],['farmer','cabbage'])===false);
ok('unsafe goat+cabbage', A.rcSafe(['goat','cabbage'],['farmer','wolf'])===false);
var sol=A.rcSolve(); ok('solve exists', sol!==null && A.rcGoal(sol[sol.length-1])===true);
console.log('RiverCrossingForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
