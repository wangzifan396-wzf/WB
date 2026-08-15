
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var c=A.convolve([1,0,0],[0.5,0.5]);
ok('len', c.length===4);
ok('c0', Math.abs(c[0]-0.5)<1e-9);
ok('c1', Math.abs(c[1]-0.5)<1e-9);
ok('c2', Math.abs(c[2]-0)<1e-9);
var ir=A.makeIR(0.5, 100, rngFactory(3));
ok('ir len', ir.length===100);
ok('ir head', ir[0]===1);
ok('ir decay', ir[50] < ir[1]);
var buf=A.wavEncode(new Float32Array([0,1]),44100);
ok('wav', buf.byteLength===44+4);
console.log('ReverbForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
