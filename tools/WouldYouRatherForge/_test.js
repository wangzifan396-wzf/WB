
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('deterministic', A.pick(2).a===A.pick(2).a);
ok('valid', (function(){var x=A.pick(4); return typeof x.a==='string' && typeof x.b==='string';})());
ok('in set', A.PAIRS.some(function(p){return p[0]===A.pick(1).a; }));
console.log('WouldYouRatherForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
