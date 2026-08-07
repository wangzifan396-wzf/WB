
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('tipAmount(100,15)=15', Math.abs(A.tipAmount(100,15)-15)<1e-9);
ok('total(100,15)=115', Math.abs(A.total(100,15)-115)<1e-9);
ok('perPerson(100,15,4)=28.75', Math.abs(A.perPerson(100,15,4)-28.75)<1e-9);
ok('roundUpDollar(28.3)=29', A.roundUpDollar(28.3)===29);
console.log('TipForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
