
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var a={re:1,im:2}, b={re:3,im:4};
var m1=A.mul(a,b); ok('mul = -5+10i', m1.re===-5 && m1.im===10);
var s=A.add(a,b); ok('add = 4+6i', s.re===4 && s.im===6);
var d=A.div({re:1,im:0},{re:2,im:0}); ok('div 1/2=0.5', Math.abs(d.re-0.5)<1e-9 && Math.abs(d.im)<1e-9);
ok('abs(3+4i)=5', A.abs({re:3,im:4})===5);
ok('arg(0,1)=pi/2', Math.abs(A.arg({re:0,im:1})-Math.PI/2)<1e-9);
var cj=A.conj(a); ok('conj = 1-2i', cj.re===1 && cj.im===-2);
var fp=A.fromPolar(2,0); ok('fromPolar(2,0)=2+0i', Math.abs(fp.re-2)<1e-9 && Math.abs(fp.im)<1e-9);
var tp=A.toPolar({re:3,im:4}); ok('toPolar r=5', Math.abs(tp.r-5)<1e-9);
console.log('ComplexForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
