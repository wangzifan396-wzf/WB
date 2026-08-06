
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
function ev(c){ return A.pEval7(c); }
ok('royal flush', ev(['AS','KS','QS','JS','TS','2C','3D'])[0]===8);
ok('four kind', ev(['AS','AH','AD','AC','KS','2C','3D'])[0]===7);
ok('full house', ev(['AS','AH','AD','KC','KH','2C','3D'])[0]===6);
ok('flush', ev(['AS','KS','9S','6S','3S','2C','3D'])[0]===5);
ok('straight', ev(['AS','KS','QD','JC','TH','2C','3D'])[0]===4);
ok('three', ev(['AS','AH','AD','KC','QH','2C','3D'])[0]===3);
ok('two pair', ev(['AS','AH','KD','KC','QH','2C','3D'])[0]===2);
ok('pair', ev(['AS','AH','KD','JC','QH','2C','3D'])[0]===1);
ok('high', ev(['AS','KH','QD','JC','9H','2C','3D'])[0]===0);
ok('cmp flush>four? no', A.pEval7(['AS','KS','9S','6S','3S','2C','3D'])[0] > A.pEval7(['AS','AH','AD','AC','KS','2C','3D'])[0] ? false : true);
console.log('PokerForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
