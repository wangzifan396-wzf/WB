
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('bounds 0deg = w,h', A.bounds(100,100,0).w===100 && A.bounds(100,100,0).h===100);
ok('bounds 90deg = h,w', (function(){var b=A.bounds(100,50,90); return Math.abs(b.w-50)<1e-9 && Math.abs(b.h-100)<1e-9;})());
ok('bounds 180deg = w,h', (function(){var b=A.bounds(100,50,180); return Math.abs(b.w-100)<1e-9 && Math.abs(b.h-50)<1e-9;})());
ok('canvasSize 45/100x100 = 142', (function(){var c=A.canvasSize(100,100,45); return c.w===142 && c.h===142;})());
console.log('RotateForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
