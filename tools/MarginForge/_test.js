
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('margin(100,60)=0.4', Math.abs(A.margin(100,60)-0.4)<1e-12);
ok('markup(100,60)=2/3', Math.abs(A.markup(100,60)-2/3)<1e-12);
ok('costFromMargin(100,0.4)=60', Math.abs(A.costFromMargin(100,0.4)-60)<1e-12);
ok('costFromMarkup(100,2/3)~60', Math.abs(A.costFromMarkup(100,2/3)-60)<1e-9);
ok('margin price<=0 NaN', isNaN(A.margin(0,5)));
console.log('MarginForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
