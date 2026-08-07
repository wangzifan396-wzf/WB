
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('octave up = 2', Math.abs(A.semitonesToFactor(12)-2)<1e-9);
ok('octave down = 0.5', Math.abs(A.semitonesToFactor(-12)-0.5)<1e-9);
ok('no shift length same', A.shift([1,2,3,4],1).length===4);
ok('double speed halves length', A.shift([1,2,3,4,5,6,7,8],2).length===4);
ok('interp midpoint', Math.abs(A.shift([0,10],0.5)[1]-5)<1e-9);
ok('invalid factor passthrough', A.shift([1,2,3],0).length===3);
console.log('PitchShiftForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
