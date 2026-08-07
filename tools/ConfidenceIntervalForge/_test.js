
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r=A.ci(100,15,25,1.96);
ok('ci se=3', Math.abs(r.se-3)<1e-9);
ok('ci margin~5.88', Math.abs(r.margin-5.88)<1e-2);
ok('ci lower~94.12', Math.abs(r.lower-94.12)<1e-2);
ok('ci invalid null', A.ci(1,1,0,1.96)===null);
console.log('ConfidenceIntervalForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
