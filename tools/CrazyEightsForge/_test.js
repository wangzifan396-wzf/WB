
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var top={s:'H',r:'K'};
ok('8 wild', A.ceValidMove({s:'S',r:'8'}, top)===true);
ok('same rank', A.ceValidMove({s:'S',r:'K'}, top)===true);
ok('same suit', A.ceValidMove({s:'H',r:'3'}, top)===true);
ok('invalid', A.ceValidMove({s:'S',r:'3'}, top)===false);
var G=A.ceDeal(A._rng(3)); ok('top not 8', G.top.r!=='8');
console.log('CrazyEightsForge _test: '+pass+' passed, '+fail+' failed'); process.exit(fail?1:0);
