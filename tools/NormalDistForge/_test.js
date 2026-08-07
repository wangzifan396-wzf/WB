
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('pdf(0,0,1)~0.3989', Math.abs(A.pdf(0,0,1)-0.398942)<1e-5);
ok('cdf(0,0,1)=0.5', Math.abs(A.cdf(0,0,1)-0.5)<1e-9);
ok('cdf(1.96,0,1)~0.975', Math.abs(A.cdf(1.96,0,1)-0.975)<1e-3);
ok('quantile(0.975,0,1)~1.96', Math.abs(A.quantile(0.975,0,1)-1.96)<1e-3);
console.log('NormalDistForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
