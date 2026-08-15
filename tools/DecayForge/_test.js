
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('lam',Math.abs(A.lambdaFromHalfLife(5730)-Math.log(2)/5730)<1e-12);
ok('frac',Math.abs(A.fractionRemaining(5730,5730)-0.5)<1e-9);
ok('rem',Math.abs(A.remaining(100,5730,0)-100)<1e-9);
ok('time',Math.abs(A.timeToFraction(5730,0.5)-5730)<1e-6);
ok('age',Math.abs(A.age(5730,0.25)-11460)<1e-6);
ok('hl',Math.abs(A.halfLives(5730,11460)-2)<1e-9);
ok('err',A.fractionRemaining(0,1)===null);
console.log('DecayForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
