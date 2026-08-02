const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
var cf=A.cuckooCreate(64,4);
ok('create shape', cf.m===64 && cf.b===4 && cf.count===0);
var t=false; try{ A.cuckooCreate(60,4); }catch(e){ t=(e.message==='BUCKETS_POW2'); }
ok('non pow2 throws', t);
ok('insert ok', A.cuckooInsert(cf,'alice').ok && cf.count===1);
ok('contains inserted', A.cuckooContains(cf,'alice'));
ok('not contains other', !A.cuckooContains(cf,'zzz-not-here'));
ok('fingerprint nonzero', A.fingerprint('anything')>=1 && A.fingerprint('anything')<=255);
ok('fingerprint stable', A.fingerprint('x')===A.fingerprint('x'));
var i1=A.idx1('alice',64), fp=A.fingerprint('alice');
ok('alt index symmetric', A.altIndex(A.altIndex(i1,fp,64),fp,64)===i1);
ok('delete works', A.cuckooDelete(cf,'alice')===true && !A.cuckooContains(cf,'alice'));
ok('delete missing false', A.cuckooDelete(cf,'ghost')===false);
var cf2=A.cuckooCreate(16,4);
var okAll=true;
for(var i=0;i<40;i++){ if(!A.cuckooInsert(cf2,'item'+i).ok) { okAll=false; break; } }
ok('bulk insert 40/64 slots', okAll);
var hits=0;
for(var i=0;i<40;i++){ if(A.cuckooContains(cf2,'item'+i)) hits++; }
ok('bulk all found', hits===40);
ok('load factor', Math.abs(A.loadFactor(cf2)-40/64)<1e-9);
console.log('CuckooForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
