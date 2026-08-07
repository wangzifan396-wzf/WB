
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('listEnzymes has EcoRI', A.listEnzymes().indexOf('EcoRI')>=0);
var r1=A.cut('GAATTCGAATTC','EcoRI');
ok('EcoRI two cuts', r1.positions.length===2 && r1.positions[0]===1 && r1.positions[1]===7);
ok('EcoRI 3 fragments', r1.count===3 && r1.fragments.join('')==='GAATTCGAATTC');
var r2=A.cut('GATATCGATATC','EcoRV');
ok('EcoRV cuts at 3 and 9', r2.positions.length===2 && r2.positions[0]===3 && r2.positions[1]===9);
ok('normSeq U->T', A.normSeq('GAU')==='GAT');
ok('normSeq strip non-ACGT', A.normSeq('g a 1 t !')==='GAT');
ok('unknown enzyme error', !!A.cut('AAA','Foo').error);
console.log('RestrictionEnzymeForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
