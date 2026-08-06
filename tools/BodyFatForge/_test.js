
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
function near(a,b,t){return Math.abs(a-b)<=(t||5e-2);}
ok('male',  near(A.navy('m',175,85,38,0), 16.97, 0.05));
ok('female',near(A.navy('f',165,70,32,95), 24.82, 0.05));
ok('female missing hip', A.navy('f',165,70,32,0)===null);
console.log('BodyFatForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
