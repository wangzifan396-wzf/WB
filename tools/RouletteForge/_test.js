
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('green 0', A.rlColor(0)==='green');
ok('red 1', A.rlColor(1)==='red');
ok('black 2', A.rlColor(2)==='black');
ok('black 11', A.rlColor(11)==='black');
ok('red 36', A.rlColor(36)==='red');
ok('payout red', A.rlPayout('red','x',7)===1);
ok('payout red miss', A.rlPayout('red','x',8)===0);
ok('payout straight', A.rlPayout('straight',5,5)===35);
console.log('RouletteForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
