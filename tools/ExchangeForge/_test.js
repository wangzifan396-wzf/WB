
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('conv',Math.abs(A.convert(100,7.1)-710)<1e-9);
ok('inv',Math.abs(A.inverse(710,7.1)-100)<1e-9);
ok('fee',Math.abs(A.convertWithFee(100,7.1,1)-702.9)<1e-9);
ok('err',A.convert(-1,7.1)===null);
ok('fmt',A.convertWithFee(100,7.1,0)===710);
console.log('ExchangeForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
