
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r1=A.clampCrop(100,100,10,10,50,50); ok('inner valid 50x50', r1.valid && r1.w===50 && r1.h===50 && r1.x===10);
var r2=A.clampCrop(100,100,80,80,50,50); ok('overflow clamped 20x20', r2.valid && r2.w===20 && r2.h===20 && r2.x===80);
var r3=A.clampCrop(100,100,-10,-10,50,50); ok('neg origin clamped', r3.x===0 && r3.y===0 && r3.w===40 && r3.h===40);
ok('area 50x50=2500', A.area(50,50)===2500);
ok('aspect 100/50=2', A.aspect(100,50)===2);
console.log('CropForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
