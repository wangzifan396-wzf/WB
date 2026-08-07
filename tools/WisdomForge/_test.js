
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('nonempty', typeof A.generate(3)==='string'&&A.generate(3).length>0);
ok('deterministic', A.generate(3)===A.generate(3));
ok('from bank', A.BANK.indexOf(A.generate(3))>=0);
console.log('WisdomForge _test: '+pass+' passed, '+fail+' failed'); process.exit(fail?1:0);
