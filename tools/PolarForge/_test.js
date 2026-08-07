
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var p=A.toPolar(1,1); ok('toPolar(1,1) r=√2', Math.abs(p.r-Math.SQRT2)<1e-9);
ok('toPolar(1,1) deg=45', Math.abs(p.deg-45)<1e-9);
var c=A.toCartesian(Math.SQRT2,45); ok('toCartesian(√2,45) ~ (1,1)', Math.abs(c.x-1)<1e-9 && Math.abs(c.y-1)<1e-9);
var p2=A.toPolar(0,0); ok('toPolar(0,0) r=0', p2.r===0);
console.log('PolarForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
