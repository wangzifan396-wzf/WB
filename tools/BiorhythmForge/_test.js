
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var z=A.cycles('2000-01-01','2000-01-01');
ok('day0 zero', z.days===0 && z.physical===0 && z.emotional===0 && z.intellectual===0);
var r=A.cycles('2000-01-01','2000-01-06');
ok('day5 in range', r.days===5 && r.physical>=-100 && r.physical<=100);
ok('finite', isFinite(r.emotional) && isFinite(r.intellectual));
console.log('BiorhythmForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
