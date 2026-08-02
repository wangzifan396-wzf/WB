const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
var uf=A.ufMake();
A.ufAdd(uf,0);A.ufAdd(uf,1);A.ufAdd(uf,2);A.ufAdd(uf,3);A.ufAdd(uf,4);
ok('init 5 sets', A.ufCount(uf)===5);
A.ufUnion(uf,0,1); A.ufUnion(uf,2,3);
ok('connected 0-1', A.ufConnected(uf,0,1)===true);
ok('not connected 0-2', A.ufConnected(uf,0,2)===false);
ok('3 sets', A.ufCount(uf)===3);
A.ufUnion(uf,1,2);
ok('connected now 0-3', A.ufConnected(uf,0,3)===true);
ok('2 sets', A.ufCount(uf)===2);
ok('find idempotent', A.ufFind(uf,0)===A.ufFind(uf,0));
ok('union idempotent', (function(){var c=A.ufCount(uf);A.ufUnion(uf,0,3);return A.ufCount(uf)===c;})());
ok('transitive', A.ufConnected(uf,4,4)===true);
var uf2=A.ufMake(); A.ufUnion(uf2,'a','b'); A.ufUnion(uf2,'b','c');
ok('string nodes', A.ufConnected(uf2,'a','c')===true && A.ufCount(uf2)===1);
ok('add new on union', (function(){var u=A.ufMake();A.ufUnion(u,7,8);return A.ufCount(u)===1;})());
console.log('UnionForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
