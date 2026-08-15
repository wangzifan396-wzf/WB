
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('h2o',Math.abs(A.molarMass('H2O').mass-18.015)<0.01);
ok('parts',A.molarMass('H2O').parts.length===2);
ok('nacl',Math.abs(A.molarMass('NaCl').mass-58.44)<0.01);
ok('invalid',A.molarMass('XYZ')===null);
ok('c6',A.molarMass('C6H12O6').parts.length===3);
console.log('MoleculeForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
