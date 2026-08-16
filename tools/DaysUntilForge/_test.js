
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('7', A.diffDays(2026,8,17,2026,8,24)===7);
ok('neg', A.diffDays(2026,8,24,2026,8,17)===-7);
ok('year', A.diffDays(2026,1,1,2027,1,1)===365);
console.log('DaysUntilForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
