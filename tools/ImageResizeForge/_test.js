
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var c=A.fitContain(1000,500,200,200); ok('fitContain', c.w===200 && c.h===100);
var cv=A.fitCover(1000,500,200,200); ok('fitCover', cv.w===400 && cv.h===200);
var cr=A.cropRect(1000,500,200,200,"center"); ok('cropRect center', cr.x===400 && cr.y===150 && cr.w===200 && cr.h===200);
var cr2=A.cropRect(1000,500,200,200,"topleft"); ok('cropRect topleft', cr2.x===0 && cr2.y===0);
var s=A.scaleBy(800,600,0.5); ok('scaleBy', s.w===400 && s.h===300);
console.log('ImageResizeForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
