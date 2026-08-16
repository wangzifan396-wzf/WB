
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var b=A.sunTimes(2025,6,21,39.9042,116.4074,8);
ok('fmt', /^\d{1,2}:\d{2}$/.test(b.sunrise) && /^\d{1,2}:\d{2}$/.test(b.sunset));
ok('order', b.sunrise < b.solarNoon && b.solarNoon < b.sunset);
ok('northSummer', b.dayLengthHours>13);
ok('southWinter', A.sunTimes(2025,6,21,-33.8688,151.2093,10).dayLengthHours<11);
ok('valid', b.valid===true);
ok('decpole', typeof A.sunTimes(2025,6,21,85,0,0).valid==='boolean');
console.log('SunriseForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
