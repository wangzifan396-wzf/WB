
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var a=A.svMake(20,7);
['bubble','insertion','selection','quick','merge'].forEach(function(name){
  var r=A.svRun(name,a);
  ok(name+' sorted', A.svSortedEq(r.arr, a.slice().sort(function(x,y){return x-y;})));
  ok(name+' comp>0', r.comp>0);
});
ok('merge no swap', A.svMerge(a).swap===0);
console.log('SortVizForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
