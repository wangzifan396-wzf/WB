
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('windChillF(40,5)~36.48', Math.abs(A.windChillF(40,5)-36.48)<1e-1);
ok('windChillF(40,0)=40', A.windChillF(40,0)===40);
ok('windChillF neg v = NaN', isNaN(A.windChillF(40,-1)));
ok('windChillC(-10,20) lower than air', (function(){var w=A.windChillC(-10,20); return w < -10;})());
console.log('WindChillForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
