
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('gcContent GCGC=1', A.gcContent('GCGC')===1);
ok('gcContent ATGCAT=1/3', Math.abs(A.gcContent('ATGCAT')-1/3)<1e-9);
ok('tmWallace ATGCAT=16', A.tmWallace('ATGCAT')===16);
ok('tmWallace GCGC=16', A.tmWallace('GCGC')===16);
ok('tmBasic GCGCGCGCGC=55', Math.abs(A.tmBasic('GCGCGCGCGC')-55)<1e-6);
ok('annealingTemp ~ tm-5', Math.abs(A.annealingTemp('GCGCGCGCGC')-(A.tmBasic('GCGCGCGCGC')-5))<1e-9);
ok('dilute 10*100/1=1000', A.dilute(10,100,1)===1000);
console.log('PcrForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
