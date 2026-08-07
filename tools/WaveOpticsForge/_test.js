
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('fringe 5e-4', Math.abs(A.fringeSpacing(500e-9,1,0.001)-5e-4)<1e-12);
ok('bright m=2', Math.abs(A.brightPosition(500e-9,1,0.001,2)-1e-3)<1e-12);
ok('firstMin', Math.abs(A.firstMinAngle(500e-9,1e-4)-Math.asin(5e-3))<1e-12);
ok('intensity center I0', Math.abs(A.singleSlitIntensity(500e-9,1e-4,1,0)-1)<1e-9);
console.log('WaveOpticsForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
