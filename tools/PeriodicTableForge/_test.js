
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('count 118', A.ELEMENTS.length===118);
ok('H mass', Math.abs(A.elBySym('H')[2]-1.008)<1e-3);
ok('C mass', Math.abs(A.elBySym('C')[2]-12.011)<1e-3);
ok('Fe mass', Math.abs(A.elBySym('Fe')[2]-55.845)<1e-2);
ok('U mass', Math.abs(A.elBySym('U')[2]-238.03)<1e-2);
ok('search O first', A.searchElements('O')[0][1]==='O');
ok('search oxygen', A.searchElements('oxygen')[0][1]==='O');
ok('search 26', A.searchElements('26')[0][1]==='Fe');
console.log('PeriodicTableForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
