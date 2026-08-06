
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('reduce pairs', JSON.stringify(A.omReducePairs([{r:'7'},{r:'7'},{r:'K'},{r:'K'},{r:'9'}]))==='[{"r":"9"}]');
ok('reduce none', A.omReducePairs([{r:'7'},{r:'9'},{r:'K'}]).length===3);
ok('reduce pair', JSON.stringify(A.omReducePairs([{r:'Q'},{r:'Q'},{r:'K'}]))==='[{"r":"K"}]');
ok('reduce single', A.omReducePairs([{r:'Q'},{r:'K'},{r:'A'}]).length===3);
var G=A.omDeal(A._rng(4));
function _noPairs(h){ var seen={}; return h.every(function(c){ if(seen[c.r]) return false; seen[c.r]=1; return true; }); }
ok('p1 no pairs', _noPairs(G.p1));
ok('p2 no pairs', _noPairs(G.p2));
ok('pool 17', G.pool.length===17);
ok('maid marker', G.maid==='Q♣');
console.log('OldMaidForge _test: '+pass+' passed, '+fail+' failed'); process.exit(fail?1:0);
