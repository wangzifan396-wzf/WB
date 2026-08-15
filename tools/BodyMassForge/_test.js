
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('devM',Math.abs(A.devine('m',180)-74.99)<0.1);
ok('devF',Math.abs(A.devine('f',160)-52.38)<0.1);
ok('range',Math.abs(A.ibwRange('m',180).min-67.5)<0.1);
ok('hamwi',Math.abs(A.hamwi('m',180)-72.99)<0.1);
ok('err',A.devine('m',0)===null);
console.log('BodyMassForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
