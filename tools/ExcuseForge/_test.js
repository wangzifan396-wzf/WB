
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('nonempty', typeof A.generate(4)==='string'&&A.generate(4).length>0);
ok('deterministic', A.generate(4)===A.generate(4));
ok('from bank', A.T.indexOf(A.generate(4))>=0);
console.log('ExcuseForge _test: '+pass+' passed, '+fail+' failed'); process.exit(fail?1:0);
