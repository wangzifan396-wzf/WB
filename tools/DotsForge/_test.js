
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var s=A.dotsNew(2,2);
A.dotsAdd(s,'h',0); A.dotsAdd(s,'h',2); A.dotsAdd(s,'v',0); A.dotsAdd(s,'v',1);
ok('box complete', A.dotsBoxComplete(s,0,0)===true);
ok('owner', s.boxes[0]!==null);
ok('score', (s.scores.A+s.scores.B)===1);
ok('start turn', A.dotsNew(3,3).turn==='A');
console.log('DotsForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
