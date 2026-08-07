
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('range 20,45,0 ~ 400/9.81', Math.abs(A.projectile(20,45,0,9.81).range - 400/9.81) < 1e-6);
ok('maxH 20,45,0 ~ 200/19.62', Math.abs(A.projectile(20,45,0,9.81).maxH - 200/19.62) < 1e-6);
ok('tFlight 20,45,0', Math.abs(A.projectile(20,45,0,9.81).tFlight - 2*20*Math.sin(Math.PI/4)/9.81) < 1e-6);
ok('traj len steps+1', A.trajectory(20,45,0,9.81,40).length===41);
ok('G default', A.G===9.81);
console.log('ProjectileForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
