
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('4w', A.gestationalAge(2026,1,1,2026,1,29).weeks===4 && A.gestationalAge(2026,1,1,2026,1,29).days===0);
ok('5w', A.gestationalAge(2026,1,1,2026,2,5).weeks===5);
ok('early', A.gestationalAge(2026,1,1,2026,4,1).trimester==='孕早期');
ok('edd', A.gestationalAge(2026,1,1,2026,1,29).edd==='2026-10-08');
ok('err', !!A.gestationalAge(2026,1,1,2025,1,1).error);
console.log('PregnancyWeekForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
