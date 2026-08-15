
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('c0',Math.abs(A.speedOfSound(0)-331.3)<1e-6);
ok('c20',Math.abs(A.speedOfSound(20)-331.3*Math.sqrt(1+20/273.15))<1e-6);
ok('doppApp',Math.abs(A.doppler(1000,10,343,true)-1000*343/333)<1e-6);
ok('doppRec',Math.abs(A.doppler(1000,10,343,false)-1000*343/353)<1e-6);
ok('sup',A.doppler(1000,400,343,true)===null);
ok('err',A.speedOfSound(-300)===null);
console.log('SoundForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
