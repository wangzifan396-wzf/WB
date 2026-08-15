
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('xl',Math.abs(A.inductiveReactance(0.1,50)-2*Math.PI*50*0.1)<1e-9);
ok('xc',Math.abs(A.capacitiveReactance(1e-4,50)-1/(2*Math.PI*50*1e-4))<1e-6);
var z=A.impedance(10,0.1,0,50);ok('z',Math.abs(z.magnitude-Math.sqrt(100+Math.pow(2*Math.PI*50*0.1,2)))<1e-6);
ok('res',Math.abs(A.resonantFreq(0.1,1e-4)-1/(2*Math.PI*Math.sqrt(1e-5)))<1e-9);
ok('err',A.inductiveReactance(0.1,0)===null);
console.log('ReactanceForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
