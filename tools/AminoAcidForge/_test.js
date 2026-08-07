
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('codonToAA AUG=M', A.codonToAA('AUG')==='M');
ok('codonToAA UUU=F', A.codonToAA('UUU')==='F');
ok('codonToAA TTT=F (T->U)', A.codonToAA('TTT')==='F');
ok('codonToAA UAA=*', A.codonToAA('UAA')==='*');
ok('aaInfo M name', A.aaInfo('M').name==='Methionine');
ok('peptideMW G = 75.07', Math.abs(A.peptideMW('G')-75.0669)<1e-3);
ok('peptideMW GA', Math.abs(A.peptideMW('GA')-(57.0519+71.0788+18.015))<1e-3);
ok('peptideMW empty=0', A.peptideMW('')===0);
console.log('AminoAcidForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
