const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
var h=A.hllCreate(12);
ok('empty count 0', A.hllCount(h)===0);
for(var i=1;i<=100;i++) A.hllAdd(h, 'item'+i);
var c=A.hllCount(h);
ok('100 distinct within 20%', c>=80 && c<=120);
var h2=A.hllCreate(12);
A.hllAdd(h2,'item1'); A.hllAdd(h2,'item1');
ok('duplicate ~1', (function(){var x=A.hllCreate(12);A.hllAdd(x,'x');A.hllAdd(x,'x');var v=A.hllCount(x);return v>=1&&v<=2;})());
// merge
var a=A.hllCreate(12), b=A.hllCreate(12);
for(var i=1;i<=50;i++) A.hllAdd(a,'m'+i);
for(var i=51;i<=100;i++) A.hllAdd(b,'m'+i);
A.hllMerge(a,b);
var cm=A.hllCount(a);
ok('merge ~100', cm>=80 && cm<=120);
var pm=A.hllCreate(10), pb=A.hllCreate(12);
var threw=false; try{ A.hllMerge(pm,pb); }catch(e){ threw=(e.message==='HLL_P_MISMATCH'); }
ok('merge p mismatch throws', threw);
ok('fnv deterministic', A.fnv1a32('abc')===A.fnv1a32('abc'));
ok('fnv unsigned', A.fnv1a32('abc')>=0);
ok('add returns hll', A.hllAdd(A.hllCreate(4),'z')!==null);
ok('count nonneg', A.hllCount(A.hllCreate(8))>=0);
ok('rho bounded', (function(){var x=A.hllCreate(12);A.hllAdd(x,'seed');var max=0;for(var i=0;i<x.m;i++)if(x.regs[i]>max)max=x.regs[i];return max>0&&max<=21;})());
console.log('HllForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
