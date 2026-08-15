
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('deterministic', A.pick(1).w===A.pick(1).w);
ok('chain', A.chain('一').w.charAt(0)==='一');
ok('chain null', A.chain('龘')===null);
console.log('IdiomForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
