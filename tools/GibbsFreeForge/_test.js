
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('deltaG(100,300,0.2)=40', Math.abs(A.deltaG(100,300,0.2)-40)<1e-9);
ok('spont(40)=false', A.spont(40)===false);
ok('spont(-5)=true', A.spont(-5)===true);
console.log('GibbsFreeForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
