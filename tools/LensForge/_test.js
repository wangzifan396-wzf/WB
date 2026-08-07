
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('imageDistance(10,30)=15', A.imageDistance(10,30)===15);
ok('magnification(10,30)=-0.5', A.magnification(10,30)===-0.5);
var c1=A.classify(10,30); ok('classify real+inverted', c1.real===true && c1.inverted===true);
ok('lensmaker(1.5,20,-20)=20', Math.abs(A.lensmaker(1.5,20,-20)-20)<1e-9);
var c2=A.classify(10,5); ok('classify virtual+upright', c2.virtual===true && c2.upright===true);
console.log('LensForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
