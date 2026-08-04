
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('verify ok', A.simonVerify(['r','g','b'],['r','g'])===true);
ok('verify bad', A.simonVerify(['r','g','b'],['r','x'])===false);
ok('verify over', A.simonVerify(['r'],['r','g'])===false);
ok('wrong idx', A.simonWrong(['r','g','b'],['r','x','b'])===1);
ok('wrong none', A.simonWrong(['r','g'],['r','g'])===-1);
ok('colors', A.SIMON_COLORS.length===4);
console.log('SimonForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
