
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r=A.zones(30,60);
ok('max', r.maxHR===190);
ok('hrr', r.hrr===130);
ok('z1', r.zones[0].lo===125 && r.zones[0].hi===138);
ok('z5', r.zones[4].lo===177 && r.zones[4].hi===190);
ok('err', !!A.zones(0,60).error);
console.log('HeartRateZoneForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
