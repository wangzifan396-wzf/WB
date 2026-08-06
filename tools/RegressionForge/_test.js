
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
// exact linear y=2x+1 -> deg1 should recover intercept~1 slope~2
var xs=[], ys=[]; for(var i=0;i<20;i++){ xs.push(i); ys.push(2*i+1); }
var c=A.regFit(xs,ys,1);
ok('intercept ~1', Math.abs(c[0]-1)<1e-6);
ok('slope ~2', Math.abs(c[1]-2)<1e-6);
ok('predict 3 -> 7', Math.abs(A.regPredict(c,3)-7)<1e-6);
// perfect fit on exact quadratic with deg2 -> R2==1
var xs2=[], ys2=[]; for(var i=0;i<15;i++){ xs2.push(i-7); ys2.push(3+i*i-2*i); }
var c2=A.regFit(xs2,ys2,2);
ok('quadratic R2=1', Math.abs(A.regR2(xs2,ys2,c2)-1)<1e-6);
// noisy data deg1 R2 should be high (>0.9)
var xr=[], yr=[], r=A._rng?null:null;
for(var i=0;i<40;i++){ xr.push(i); yr.push(1.5*xr[i]-0.5+(Math.sin(i)*0.05)); }
var c3=A.regFit(xr,yr,1);
ok('noisy high R2', A.regR2(xr,yr,c3)>0.9);
console.log('RegressionForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
