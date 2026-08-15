
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r1=A.fromWavelength(1e-6);
ok('freq',Math.abs(r1.frequency-299792458/1e-6)<1);
ok('energy',Math.abs(r1.energy-6.62607015e-34*299792458/1e-6)<1e-28);
var r2=A.fromFreq(5e14);
ok('wl',Math.abs(r2.wavelength-299792458/5e14)<1e-9);
ok('e2',Math.abs(r2.energy-6.62607015e-34*5e14)<1e-30);
ok('err',A.fromFreq(0)===null);
console.log('PhotonForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
