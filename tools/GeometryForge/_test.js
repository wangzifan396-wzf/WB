
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
function near(a,b,t){return Math.abs(a-b)<=t;}
var r1=A.solveTriangle({a:3,b:4,c:5});
ok('345 angles', near(r1.A,36.87,0.1)&&near(r1.B,53.13,0.1)&&near(r1.C,90,0.1));
ok('345 area', near(r1.area,6,1e-6));
var r2=A.solveTriangle({a:1,b:1,c:1});
ok('equilateral', near(r2.A,60,1e-6)&&near(r2.area,0.4330,1e-3));
var r3=A.solveTriangle({a:5,b:7,C:60});
ok('sas c', near(r3.c,6.245,0.01));
console.log('GeometryForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
