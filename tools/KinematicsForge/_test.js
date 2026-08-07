
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('finalV(0,9.81,2)=19.62', Math.abs(A.finalV(0,9.81,2)-19.62)<1e-9);
ok('disp(0,9.81,2)=19.62', Math.abs(A.disp(0,9.81,2)-19.62)<1e-9);
ok('finalVFromS(0,9.81,19.62)=19.62', Math.abs(A.finalVFromS(0,9.81,19.62)-19.62)<1e-6);
ok('avgV(0,20)=10', A.avgV(0,20)===10);
ok('dispFromUVT(0,20,2)=20', A.dispFromUVT(0,20,2)===20);
console.log('KinematicsForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
