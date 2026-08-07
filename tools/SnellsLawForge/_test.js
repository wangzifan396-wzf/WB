
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('air->water 30 ~22.09', Math.abs(A.refract(1,1.33,30)-22.09)<0.1);
ok('TIR n1<n2 ->null', A.refract(1.33,1,60)===null);
ok('critical water->air ~48.75', Math.abs(A.critical(1.33,1)-48.75)<0.2);
console.log('SnellsLawForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
