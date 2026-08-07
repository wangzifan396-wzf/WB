
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var z=new Array(30).fill(5); var out=A.kalman(z,0.01,1,0,1);
ok('ends near 5', Math.abs(out[out.length-1]-5)<0.05);
ok('monotone approach from 0', out[0] < out[3]);
ok('first step < 5', out[0] < 5);
console.log('KalmanForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
