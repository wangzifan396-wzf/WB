
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('periodFromAU(1)~365.25', Math.abs(A.periodFromAU(1)-365.25)<1e-9);
ok('periodFromAU(2)', Math.abs(A.periodFromAU(2)-365.25*Math.pow(2,1.5))<1e-6);
ok('geoHeight earth ~3.578e7', Math.abs(A.geoHeight(A.MU_EARTH,A.R_EARTH,86164) - 3.5783e7) < 1e5);
ok('escapeVel earth ~11188', Math.abs(A.escapeVelocity(A.R_EARTH,A.MU_EARTH)-11188) < 30);
ok('orbitalVel earth ~7910', Math.abs(A.orbitalVelocity(A.R_EARTH,A.MU_EARTH)-7910) < 30);
console.log('OrbitForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
