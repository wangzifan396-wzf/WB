
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r=A.buildItinerary('Tokyo',3,'balanced');
ok('days', r.daysOut.length===3);
ok('slots', r.daysOut[0].slots.length===3);
ok('asc', r.daysOut[0].slots[0].time < r.daysOut[0].slots[1].time);
ok('pack', r.packing.length>=5);
ok('err', !!A.buildItinerary('X',0,'balanced').error);
ok('relaxed', A.buildItinerary('X',2,'relaxed').daysOut[0].slots.length===2);
console.log('ItineraryForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
