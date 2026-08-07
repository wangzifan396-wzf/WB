
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var s=A.simplify(6,8); ok('simplify(6,8)', s.num===3 && s.den===4);
var a=A.add(1,2,1,3); ok('1/2+1/3=5/6', a.num===5 && a.den===6);
var mu=A.mul(2,3,3,4); ok('2/3*3/4=1/2', mu.num===1 && mu.den===2);
var dv=A.div(1,2,1,4); ok('(1/2)/(1/4)=2', dv.num===2 && dv.den===1);
ok('toDecimal(1/3,4)', Math.abs(A.toDecimal(1,3,4)-0.3333)<1e-9);
var fd=A.fromDecimal(0.75); ok('0.75->3/4', fd.num===3 && fd.den===4);
var fd2=A.fromDecimal(0.375); ok('0.375->3/8', fd2.num===3 && fd2.den===8);
ok('gcd(12,18)=6', A.gcd(12,18)===6);
console.log('FractionForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
