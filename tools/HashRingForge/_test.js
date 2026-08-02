const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
var r=A.ringCreate(['a','b','c'], 100);
ok('virtual count 300', r.keys.length===300);
ok('get valid node', ['a','b','c'].indexOf(A.ringGet(r,'key1'))>=0);
ok('deterministic', A.ringGet(r,'key1')===A.ringGet(r,'key1'));
var seen={a:0,b:0,c:0};
for(var i=0;i<2000;i++){ seen[A.ringGet(r,'k'+i)]++; }
ok('a covered', seen.a>0);
ok('b covered', seen.b>0);
ok('c covered', seen.c>0);
A.ringRemoveNode(r,'b');
ok('virtual after remove 200', r.keys.length===200);
var nob=true;
for(var j=0;j<2000;j++){ if(A.ringGet(r,'k'+j)==='b') nob=false; }
ok('b never returned', nob);
ok('remaining valid', ['a','c'].indexOf(A.ringGet(r,'key1'))>=0);
A.ringAddNode(r,'d');
ok('virtual after add 300', r.keys.length===300);
var dcover=false;
for(var q=0;q<2000;q++){ if(A.ringGet(r,'k'+q)==='d'){ dcover=true; break; } }
ok('d covered after add', dcover);
ok('get returns string', typeof A.ringGet(r,'x')==='string');
console.log('HashRingForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
