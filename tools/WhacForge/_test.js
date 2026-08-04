
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var s={holes:9, mole:3, score:0};
ok('hit', A.whacWhack(s,3).hit===true);
ok('score+', s.score===1);
ok('move', s.mole!==3);
ok('miss', A.whacWhack(s,0).hit===false);
ok('score-', s.score===0);
console.log('WhacForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
