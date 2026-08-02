const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
var arr=[3,2,-1,6,5,4,-3,3];
var fw=A.fwBuild(arr);
ok('prefix 0', A.fwPrefix(fw,0)===3);
ok('prefix 3', A.fwPrefix(fw,3)===10);
ok('prefix all', A.fwPrefix(fw,7)===19);
ok('prefix negative idx', A.fwPrefix(fw,-1)===0);
ok('prefix clamp', A.fwPrefix(fw,100)===19);
ok('range 1..5', A.fwRange(fw,1,5)===16);
ok('range single', A.fwRange(fw,3,3)===6);
ok('range empty', A.fwRange(fw,5,2)===0);
ok('get', A.fwGet(fw,4)===5);
ok('toArray roundtrip', JSON.stringify(A.fwToArray(fw))===JSON.stringify(arr));
A.fwUpdate(fw,2,4);
ok('after update get', A.fwGet(fw,2)===3);
ok('after update prefix', A.fwPrefix(fw,7)===23);
var threw=false; try{ A.fwUpdate(fw,99,1); }catch(e){ threw=true; }
ok('oob update throws', threw);
var fw2=A.fwBuild([1,1,1,1,1]);
ok('lowerBound 3', A.fwLowerBound(fw2,3)===2);
ok('lowerBound 1', A.fwLowerBound(fw2,1)===0);
ok('lowerBound overflow', A.fwLowerBound(fw2,6)===-1);
var big=[]; for(var i=0;i<1000;i++) big.push(i);
var fw3=A.fwBuild(big);
ok('big prefix', A.fwPrefix(fw3,999)===499500);
ok('big range', A.fwRange(fw3,100,199)===14950);
console.log('FenwickForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
