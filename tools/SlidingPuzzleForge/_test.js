
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var b=A.spSolved(4); ok('solved detected', A.spSolvedChk(b)===true);
ok('not solved', A.spSolvedChk([1,2,3,4,5,6,7,8,9,10,11,12,13,14,0,15])===false);
var sh=A.spShuffle(A._rng(7),4); ok('shuffle len', sh.length===16); ok('shuffle not solved', A.spSolvedChk(sh)===false);
var blank=A.spBlank(sh); var adj=(blank%4!==0)?blank-1:blank+1; var mv=A.spMove(sh, adj); ok('move returns board', Array.isArray(mv));
var nb=A.spMove([1,2,3,4,5,6,7,8,9,10,11,12,13,14,0,15],15); ok('move blank adj', nb!==null && nb[14]===15 && nb[15]===0);
var bad=A.spMove([1,2,3,4,5,6,7,8,9,10,11,12,13,14,0,15],0); ok('non-adjacent null', bad===null);
console.log('SlidingPuzzleForge _test: '+pass+' passed, '+fail+' failed'); process.exit(fail?1:0);
