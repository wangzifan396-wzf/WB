
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var G=A.gfDeal(A._rng(5)); ok('deal sizes', G.p1.length===7 && G.p2.length===7 && G.pool.length===38);
var hand=[{s:'S',r:'7'},{s:'H',r:'7'},{s:'D',r:'9'}]; ok('has', A.gfHas(hand,'7')===true);
ok('count', A.gfCount(hand,'7')===2);
ok('pair removed', A.gfRemovePairs([{s:'S',r:'7'},{s:'H',r:'7'},{s:'D',r:'9'}]).length===1);
console.log('GoFishForge _test: '+pass+' passed, '+fail+' failed'); process.exit(fail?1:0);
