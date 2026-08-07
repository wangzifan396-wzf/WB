
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('(0,0) in set = MAX', A.iterate(0,0,256)===256);
ok('(2,0) escapes quickly', A.iterate(2,0,256)===2);
ok('(0.3,0.5) finite', A.iterate(0.3,0.5,256)>=1 && A.iterate(0.3,0.5,256)<=256);
console.log('MandelbrotForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
