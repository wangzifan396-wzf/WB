
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('parse',JSON.stringify(A.parseFormula('C6H12O6'))===JSON.stringify({C:6,H:12,O:6}));
ok('massH2O',Math.abs(A.molarMass('H2O')-18.015)<0.01);
ok('massNaCl',Math.abs(A.molarMass('NaCl')-(22.990+35.45))<0.01);
ok('moles',Math.abs(A.toMoles(18.015,'H2O')-1)<1e-3);
ok('grams',Math.abs(A.toGrams(2,'H2O')-36.03)<0.1);
ok('bad',A.molarMass('Xy2')===null);
console.log('MoleForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
