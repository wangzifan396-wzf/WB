const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
const J=JSON.stringify;
var sl=A.slCreate(42);
[30,10,50,20,40,5].forEach(k=>A.slInsert(sl,k));
ok('sorted order', J(A.slToArray(sl))===J([5,10,20,30,40,50]));
ok('size', sl.size===6);
ok('search hit', A.slSearch(sl,20).found===true);
ok('search miss', A.slSearch(sl,21).found===false);
// value + update semantics
A.slInsert(sl,20,'twenty');
ok('update no size change', sl.size===6 && A.slSearch(sl,20).val==='twenty');
ok('insert reports updated', A.slInsert(sl,20,'x').updated===true);
ok('nan key error', A.slInsert(sl,NaN).ok===false);
// range
ok('range mid', J(A.slRange(sl,10,40))===J([10,20,30,40]));
ok('range empty', J(A.slRange(sl,60,99))===J([]));
ok('range all', A.slRange(sl,-1e9,1e9).length===6);
// delete
ok('delete hit', A.slDelete(sl,30)===true && sl.size===5);
ok('delete miss', A.slDelete(sl,30)===false);
ok('after delete order', J(A.slToArray(sl))===J([5,10,20,40,50]));
// determinism: same seed -> same levels
var a=A.slCreate(7), b=A.slCreate(7);
for(var i=0;i<50;i++){ A.slInsert(a,i); A.slInsert(b,i); }
ok('deterministic level', a.level===b.level && a.level>1);
// stress: 1000 shuffled keys stay sorted
var big=A.slCreate(99), keys=[];
for(var k=0;k<1000;k++) keys.push((k*677)%1000);
keys.forEach(x=>A.slInsert(big,x));
var arr=A.slToArray(big);
var sorted=true; for(var t=1;t<arr.length;t++) if(arr[t-1]>=arr[t]) sorted=false;
ok('stress sorted unique', sorted && arr.length===1000 && big.size===1000);
ok('stress range', A.slRange(big,100,199).length===100);
console.log('SkipForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
