
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('pxToMm(96,96)=25.4', Math.abs(A.pxToMm(96,96)-25.4)<1e-9);
ok('pxToInch(96,96)=1', Math.abs(A.pxToInch(96,96)-1)<1e-9);
ok('mmToPx(25.4,96)=96', Math.abs(A.mmToPx(25.4,96)-96)<1e-9);
ok('length(0,0,3,4)=5', A.length(0,0,3,4)===5);
console.log('ScreenRulerForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
