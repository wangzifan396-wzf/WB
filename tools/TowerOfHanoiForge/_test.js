
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('3 moves', A.hanoiSolve(3).length===7);
ok('1 move', A.hanoiSolve(1).length===1);
ok('valid pegs', A.hanoiSolve(3).every(function(mv){ return ['A','B','C'].indexOf(mv.from)>=0 && ['A','B','C'].indexOf(mv.to)>=0; }));
ok('apply', (function(){var t={A:[3,2,1],B:[],C:[]}; A.hanoiApply(t,{from:'A',to:'C'}); return t.C.length===1 && t.A.length===2;})());
console.log('TowerOfHanoiForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
