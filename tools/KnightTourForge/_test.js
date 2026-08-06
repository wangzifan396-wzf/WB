
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var t=A.ktTour(6);
ok('len', t.length===36);
var seen={}, okadj=true;
for(var i=0;i<t.length;i++){ var k=t[i][0]*6+t[i][1]; if(seen[k]) okadj=false; seen[k]=1; if(i>0){ var dr=Math.abs(t[i][0]-t[i-1][0]), dc=Math.abs(t[i][1]-t[i-1][1]); if(!((dr===2&&dc===1)||(dr===1&&dc===2))) okadj=false; } }
ok('covers all', Object.keys(seen).length===36);
ok('adjacent', okadj);
console.log('KnightTourForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
