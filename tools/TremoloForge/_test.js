
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var sig=[]; for(var i=0;i<1000;i++) sig.push(Math.sin(2*Math.PI*3*i/100));
var t=A.tremolo(sig,44100,5,0.5); ok('len', t.length===sig.length);
ok('mod', t[100]!==sig[100]);
var flat=A.tremolo(sig,44100,5,0); ok('flat', JSON.stringify(flat)===JSON.stringify(sig));
var b=A.wavEncode(sig,44100); var u8=new Uint8Array(b);
ok('wav', String.fromCharCode(u8[0],u8[1],u8[2],u8[3])==='RIFF');
console.log('TremoloForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
