
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('sma len4', A.sma([1,2,3,4],2).length===4);
ok('sma last 3.5', Math.abs(A.sma([1,2,3,4],2)[3]-3.5)<1e-9);
ok('ema alpha=1 =data', A.ema([5,6,7],1)[2]===7);
ok('ema alpha=0.5', Math.abs(A.ema([0,0,0,8],0.5)[3]-4)<1e-9);
console.log('MovingAverageForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
