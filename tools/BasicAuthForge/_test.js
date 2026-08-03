
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('enc known', A.encBasic('user','pass')==='dXNlcjpwYXNz');
ok('dec known', A.decBasic('dXNlcjpwYXNz')==='user:pass');
ok('rt', A.decBasic(A.encBasic('a:b@c','pw d'))==='a:b@c:pw d');
ok('b64enc', A.b64enc([97,98,99])==='YWJj');
console.log('BasicAuthForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
