const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
var bs=A.bitsetCreate(33);
ok('words 2', bs.words===2);
A.bitsetSet(bs,0); A.bitsetSet(bs,32);
ok('get 0', A.bitsetGet(bs,0)===1);
ok('get 32', A.bitsetGet(bs,32)===1);
ok('get 5', A.bitsetGet(bs,5)===0);
ok('count 2', A.bitsetCount(bs)===2);
A.bitsetSet(bs,1);
ok('count 3', A.bitsetCount(bs)===3);
A.bitsetClear(bs,0);
ok('count 2 after clear', A.bitsetCount(bs)===2);
A.bitsetFlip(bs,5);
ok('flip set', A.bitsetGet(bs,5)===1);
A.bitsetFlip(bs,5);
ok('flip clear', A.bitsetGet(bs,5)===0);
var a=A.bitsetCreate(8), b=A.bitsetCreate(8);
A.bitsetSet(a,0); A.bitsetSet(a,2); A.bitsetSet(b,1);
ok('and 0', A.bitsetCount(A.bitsetAnd(a,b))===0);
ok('or 3', A.bitsetCount(A.bitsetOr(a,b))===3);
ok('xor 3', A.bitsetCount(A.bitsetXor(a,b))===3);
var thr=false; try{ A.bitsetSet(bs,100); }catch(e){ thr=(e.message==='BIT_OUT_OF_RANGE'); }
ok('out of range throws', thr);
var sz=false; try{ A.bitsetAnd(A.bitsetCreate(8), A.bitsetCreate(16)); }catch(e){ sz=(e.message==='BITSET_SIZE_MISMATCH'); }
ok('size mismatch throws', sz);
console.log('BitsetForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
