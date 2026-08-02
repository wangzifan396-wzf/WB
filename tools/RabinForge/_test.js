const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
const J=JSON.stringify;
// hash determinism + difference
ok('hash deterministic', A.rkHash('abc')===A.rkHash('abc'));
ok('hash differs', A.rkHash('abc')!==A.rkHash('abd'));
ok('pow', A.rkPow(256,3,1000000007)===16777216);
// classic
ok('single match', J(A.rkSearch('hello world','world').value)===J([6]));
ok('multi occur', J(A.rkSearch('abracadabra','abra').value)===J([0,7]));
ok('overlap', J(A.rkSearch('aaaa','aa').value)===J([0,1,2]));
ok('no match', J(A.rkSearch('abc','xyz').value)===J([]));
ok('pattern longer', J(A.rkSearch('ab','abc').value)===J([]));
ok('full text match', J(A.rkSearch('abc','abc').value)===J([0]));
ok('match at end', J(A.rkSearch('xxabc','abc').value)===J([2]));
ok('empty pattern error', A.rkSearch('abc','').error!==null);
ok('non-string error', A.rkSearch(123,'a').error!==null);
// unicode (charCodeAt-based, still consistent)
ok('cjk match', J(A.rkSearch('滚动哈希滚动','滚动').value)===J([0,4]));
// multi-pattern
const mr=A.rkSearchMulti('abracadabra cadabra abra',['abra','cada']);
ok('multi abra', J(mr.value['abra'])===J([0,7,15,20]));
ok('multi cada', J(mr.value['cada'])===J([4,12]));
ok('multi empty list error', A.rkSearchMulti('x',[]).error!==null);
console.log('RabinForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
