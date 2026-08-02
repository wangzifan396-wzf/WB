const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('failure abab', JSON.stringify(A.kmpFailure('abab'))==='[0,0,1,2]');
ok('failure aaaa', JSON.stringify(A.kmpFailure('aaaa'))==='[0,1,2,3]');
ok('failure abcd', JSON.stringify(A.kmpFailure('abcd'))==='[0,0,0,0]');
ok('failure aabaaa', JSON.stringify(A.kmpFailure('aabaaa'))==='[0,1,0,1,2,2]');
ok('search classic', JSON.stringify(A.kmpSearch('ababcabcabababd','ababd'))==='[10]');
ok('search multi', JSON.stringify(A.kmpSearch('aaaa','aa'))==='[0,1,2]');
ok('search overlap', JSON.stringify(A.kmpSearch('abababa','aba'))==='[0,2,4]');
ok('search none', JSON.stringify(A.kmpSearch('hello','xyz'))==='[]');
ok('search empty pattern', JSON.stringify(A.kmpSearch('abc',''))==='[]');
ok('search full match', JSON.stringify(A.kmpSearch('abc','abc'))==='[0]');
ok('count', A.kmpCount('mississippi','issi')===2);
ok('first found', A.kmpFirst('hello world','world')===6);
ok('first missing', A.kmpFirst('hello','zz')===-1);
ok('unicode', JSON.stringify(A.kmpSearch('\u4f60\u597d\u4e16\u754c\u4f60\u597d','\u4f60\u597d'))==='[0,4]');
ok('highlight', A.kmpHighlight('xabx','ab')==='x\u3010ab\u3011x');
console.log('KmpForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
