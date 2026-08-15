
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var s=new Float32Array([1,0,0,0]); var o=A.applyEcho(s,2,0.5,1);
ok('length', o.length===6);
ok('delay echo', Math.abs(o[2]-0.5)<1e-6);
ok('original', Math.abs(o[0]-1)<1e-6);
var buf=A.wavEncode(new Float32Array([0,1,-1,0.5]),44100);
ok('wav header', buf.byteLength===44+8);
var u8=new Uint8Array(buf);
ok('wav riff', String.fromCharCode(u8[0],u8[1],u8[2],u8[3])==='RIFF');
console.log('EchoForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
