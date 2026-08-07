
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('buoyantForce(1000,0.002)=19.62', Math.abs(A.buoyantForce(1000,0.002)-19.62)<1e-9);
ok('buoyantForce(1,1,9.81)=9.81', Math.abs(A.buoyantForce(1,1,9.81)-9.81)<1e-9);
ok('floats(800,1000)=true', A.floats(800,1000)===true);
ok('floats(1200,1000)=false', A.floats(1200,1000)===false);
ok('displacedVolume(2,1000)=0.002', A.displacedVolume(2,1000)===0.002);
ok('apparentWeight float=0', A.apparentWeight(2,800,1000)===0);
ok('apparentWeight sink>0', A.apparentWeight(2,1200,1000)>0);
console.log('BuoyancyForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
