
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('maxHR(30)=190', A.maxHR(30)===190);
ok('maxHR tanaka(30)=187', A.maxHR(30,'tanaka')===187);
ok('karvonen(30,60,0.7)=151', A.karvonen(30,60,0.7)===151);
ok('karvonen tanaka(30,60,0.7)=149', A.karvonen(30,60,0.7,'tanaka')===149);
var z=A.zones(30,60); ok('zones length 5', z.zones.length===5 && z.max===190);
console.log('HeartZoneForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
