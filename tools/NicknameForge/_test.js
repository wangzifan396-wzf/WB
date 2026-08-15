
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('deterministic', A.gen(9)===A.gen(9));
ok('cn len', A.gen(9).length>=3);
ok('en style', A.gen(3,'en').length>0);
console.log('NicknameForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
