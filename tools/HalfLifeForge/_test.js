
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
function near(a,b,t){return Math.abs(a-b)<=(t||1e-6);}
ok('decay 1 half', near(A.decay(100,10,10),50));
ok('decay 0', near(A.decay(100,0,10),100));
ok('fraction', near(A.fractionRemaining(5730,5730),0.5));
ok('age 25%', near(A.age(100,25,5730),11460));
ok('age 0', A.age(100,0,5730)===null);
ok('C14 const', near(A.COMMON["碳-14"],5730));
console.log('HalfLifeForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
