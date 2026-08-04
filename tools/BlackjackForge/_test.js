
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('bj 21', A.bjHand(['A','K'])===21);
ok('ace soft', A.bjHand(['A','A','9'])===21);
ok('bust', A.bjHand(['K','Q','5'])===25);
ok('ten', A.bjHand(['10','7'])===17);
ok('isbj', A.bjIsBlackjack(['A','K'])===true);
ok('not bj', A.bjIsBlackjack(['A','K','K'])===false);
console.log('BlackjackForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
