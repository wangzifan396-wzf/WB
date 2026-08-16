
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('w1', A.isoWeek(2025,1,1).week===1);
ok('yend', A.isoWeek(2025,12,31).year===2026 && A.isoWeek(2025,12,31).week===1);
ok('wk53', (function(){var r=A.isoWeek(2021,1,1); return r.week===53 && r.year===2020;})());
ok('dec30', (function(){var r=A.isoWeek(2024,12,30); return r.week===1 && r.year===2025;})());
ok('err', !!A.fromStr('bad').error);
console.log('WeekNumberForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
