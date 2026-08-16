
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('2000', A.isLeap(2000)===true);
ok('1900', A.isLeap(1900)===false);
ok('2024', A.isLeap(2024)===true);
ok('2023', A.isLeap(2023)===false);
ok('feb', A.daysInFeb(2024)===29 && A.daysInFeb(2023)===28);
ok('yr', A.daysInYear(2024)===366);
ok('between', A.leapYearsBetween(2000,2024)===7);
console.log('LeapYearForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
