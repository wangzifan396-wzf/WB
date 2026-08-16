
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var sig=[]; for(var i=0;i<2000;i++) sig.push(Math.sin(2*Math.PI*3*i/100));
var c=A.chorus(sig,44100,3,25,8,0.5); ok('len', c.length===sig.length);
ok('thick', c[500]!==sig[500]);
ok('dry', Math.abs(c[0]-(sig[0]*0.4))<1e-6);
var b=A.wavEncode(sig,44100); var u8=new Uint8Array(b);
ok('wav', String.fromCharCode(u8[0],u8[1],u8[2],u8[3])==='RIFF');
console.log('ChorusForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
