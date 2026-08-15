
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('force', Math.abs(A.force(1000,1000,1) - 6.674e-5) < 1e-9);
ok('earth g', Math.abs(A.surfaceGravity(A.PLANETS.earth.M, A.PLANETS.earth.R)-9.81) < 0.05);
ok('orbital', Math.abs(A.orbitalVelocity(A.PLANETS.earth.M, A.PLANETS.earth.R)-7.9e3) < 100);
ok('weight moon', Math.abs(A.weightOnPlanet(70,'moon')-113.4) < 0.5);
ok('zero r', A.force(1,1,0)===0);
console.log('GravityForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
