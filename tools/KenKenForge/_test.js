
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var b=A.kkBuild(4,3);
ok('size', b.size===4);
var latinOk=true; for(var r=0;r<4;r++){var s={}; for(var c=0;c<4;c++){ if(s[b.solution[r][c]]) latinOk=false; s[b.solution[r][c]]=1; }} ok('solution latin', latinOk);
ok('solution satisfies cages', A.kkCheck(b.solution, b)===true);
ok('opok +', A.kkOpOk('+',[2,3],5)===true);
ok('opok /', A.kkOpOk('/',[6,2],3)===true);
console.log('KenKenForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
