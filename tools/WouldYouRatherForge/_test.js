
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('pairs>=12', A.PAIRS.length>=12);
ok('pick len2', A.pick(3).length===2);
ok('tally', (function(){var t=A.tally([0,1,0]); return t.a===2 && t.b===1;})());
console.log('WouldYouRatherForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
