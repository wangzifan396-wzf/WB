const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
var s1=A.prngSequence('mulberry32','seed',5), s2=A.prngSequence('mulberry32','seed',5);
ok('mulberry deterministic', JSON.stringify(s1)===JSON.stringify(s2));
ok('mulberry seed differs', JSON.stringify(A.prngSequence('mulberry32','a',5))!==JSON.stringify(A.prngSequence('mulberry32','b',5)));
ok('sfc32 deterministic', JSON.stringify(A.prngSequence('sfc32','x',5))===JSON.stringify(A.prngSequence('sfc32','x',5)));
ok('xoshiro deterministic', JSON.stringify(A.prngSequence('xoshiro128ss','x',5))===JSON.stringify(A.prngSequence('xoshiro128ss','x',5)));
ok('algos differ', JSON.stringify(A.prngSequence('sfc32','x',5))!==JSON.stringify(A.prngSequence('mulberry32','x',5)));
var big=A.prngSequence('mulberry32','range-test',2000);
ok('all in [0,1)', big.every(function(x){ return x>=0 && x<1; }));
var mean=big.reduce(function(a,b){return a+b;},0)/big.length;
ok('mean near 0.5', Math.abs(mean-0.5)<0.05);
var ints=A.prngIntRange('sfc32','dice',1000,1,6);
ok('int range bounds', ints.every(function(x){ return x>=1 && x<=6 && Number.isInteger(x); }));
ok('int range covers', [1,2,3,4,5,6].every(function(v){ return ints.indexOf(v)>=0; }));
var arr=[1,2,3,4,5,6,7,8,9,10];
var sh1=A.prngShuffle('mulberry32','mix',arr), sh2=A.prngShuffle('mulberry32','mix',arr);
ok('shuffle deterministic', JSON.stringify(sh1)===JSON.stringify(sh2));
ok('shuffle is permutation', JSON.stringify(sh1.slice().sort(function(a,b){return a-b;}))===JSON.stringify(arr));
ok('shuffle no mutate', JSON.stringify(arr)==='[1,2,3,4,5,6,7,8,9,10]');
var threw=false; try{ A.prngCreate('bogus','x'); }catch(e){ threw=true; }
ok('unknown algo throws', threw);
ok('seedHash deterministic', A.seedHash('k')()===A.seedHash('k')());
console.log('PrngForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
