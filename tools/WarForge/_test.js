
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('cmp high', A.warCmp({r:'A',s:'S'},{r:'2',s:'H'})>0);
ok('cmp low', A.warCmp({r:'3',s:'S'},{r:'K',s:'H'})<0);
var res=A.warPlay(A._rng(9)); ok('game ends', res.winner===1||res.winner===2);
console.log('WarForge _test: '+pass+' passed, '+fail+' failed'); process.exit(fail?1:0);
