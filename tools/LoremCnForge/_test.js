
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('deterministic', A.gen(7,2,3)===A.gen(7,2,3));
ok('para count', A.gen(7,3,4).split('\n\n').length===3);
ok('nonempty', A.gen(1,1,1).length>0);
console.log('LoremCnForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
