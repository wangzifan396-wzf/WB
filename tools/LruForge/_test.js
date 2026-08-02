const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
var c=A.lruCreate(2);
A.lruPut(c,'a',1); A.lruPut(c,'b',2);
ok('size 2', A.lruSize(c)===2);
ok('keys ab', JSON.stringify(A.lruKeys(c))==='["a","b"]');
ok('get a moves to recent', (function(){A.lruGet(c,'a');return JSON.stringify(A.lruKeys(c))==='["b","a"]';})());
A.lruPut(c,'c',3);
ok('evicts oldest b', A.lruKeys(c).indexOf('b')===-1);
ok('keys ca', JSON.stringify(A.lruKeys(c))==='["a","c"]');
ok('get b undefined', A.lruGet(c,'b')===undefined);
A.lruPut(c,'a',99);
ok('update keeps key', JSON.stringify(A.lruKeys(c))==='["c","a"]' && A.lruGet(c,'a')===99);
A.lruPut(c,'d',4);
ok('evict c', A.lruKeys(c).indexOf('c')===-1 && A.lruSize(c)===2);
var e=A.lruCreate(1); A.lruPut(e,'x',1); A.lruPut(e,'y',2);
ok('cap1 holds 1', A.lruSize(e)===1 && A.lruGet(e,'x')===undefined && A.lruGet(e,'y')===2);
ok('empty get undefined', A.lruGet(A.lruCreate(3),'z')===undefined);
ok('put returns cache', A.lruPut(A.lruCreate(2),'k',1)!==null);
console.log('LruForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
