
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('dragForce(1.225,30,0.47,0.5)~129.54', Math.abs(A.dragForce(1.225,30,0.47,0.5)-129.5437)<1e-3);
ok('terminalVelocity(70,9.81,1.225,0.47,0.5)~69.07', Math.abs(A.terminalVelocity(70,9.81,1.225,0.47,0.5)-69.074)<1e-2);
ok('reynolds(1.225,30,0.1,1.8e-5)~204166', Math.abs(A.reynolds(1.225,30,0.1,1.8e-5)-204166.7)<1e-1);
console.log('DragForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
