
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('momentum(2,3)=6', A.momentum(2,3)===6);
ok('kineticEnergy(2,3)=9', A.kineticEnergy(2,3)===9);
var e=A.elastic1D(1,2,1,0); ok('equal-mass elastic swap', Math.abs(e.v1-0)<1e-9 && Math.abs(e.v2-2)<1e-9);
ok('elastic momentum conserved', (function(){var e=A.elastic1D(2,1,3,-1);return Math.abs((2*1+3*-1)-(2*e.v1+3*e.v2))<1e-9;})());
ok('elastic neg mass null', A.elastic1D(-1,1,1,0)===null);
console.log('MomentumForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
