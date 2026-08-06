
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var b=A.ckNew();
ok('init 12/12', A.ckCount(b,'r')===12 && A.ckCount(b,'b')===12);
ok('init moves', A.ckMoves(b,'r').length===7);
var cb=new Array(64).fill(null); cb[3*8+2]='r'; cb[2*8+3]='b';
var mv=A.ckMoves(cb,'r'); ok('has capture', mv.some(function(m){return m.cap;}));
var cap=mv.filter(function(m){return m.cap;})[0]; var nb=A.ckApply(cb,cap);
ok('capture removes', A.ckCount(nb,'b')===0 && A.ckCount(nb,'r')===1);
console.log('CheckersForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
