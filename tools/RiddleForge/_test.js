
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('deterministic', A.pick(3).q===A.pick(3).q);
ok('valid', (function(){var x=A.pick(5); return typeof x.q==='string' && typeof x.a==='string';})());
ok('in set', A.RIDDLES.indexOf(A.pick(1))>=0);
console.log('RiddleForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
