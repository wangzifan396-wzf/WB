const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
function eq(a,b){ return JSON.stringify(a)===JSON.stringify(b); }
ok('push empty', eq(A.heapPush([],5),[5]));
ok('push min reorders', eq(A.heapPush([5],3),[3,5]));
ok('pop min value', A.heapPop(A.heapify([3,5,1,4,2])).value===1);
ok('sort min', eq(A.heapSort([5,3,8,1,2]),[1,2,3,5,8]));
ok('sort max', eq(A.heapSort([5,3,8,1,2],function(a,b){return a>b;}),[8,5,3,2,1]));
ok('empty pop undefined', A.heapPop([]).value===undefined);
ok('heapify root min', A.heapify([3,1,2])[0]===1);
ok('duplicates', eq(A.heapSort([2,2,1,1]),[1,1,2,2]));
ok('length maintained', A.heapPop([1,2,3]).heap.length===2);
ok('single sort', eq(A.heapSort([7]),[7]));
ok('immutable push', (function(){ var a=[1]; A.heapPush(a,0); return a.length===1; })());
ok('sort empty', eq(A.heapSort([]),[]));
console.log('HeapForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
