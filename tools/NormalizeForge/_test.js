
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var pk=A.normalize([0,0.5,-0.5],'peak',1); ok('peak', Math.abs(Math.abs(pk[1])-1)<1e-9);
var sig=[]; for(var i=0;i<100;i++) sig.push(Math.sin(2*Math.PI*3*i/100));
var rm=A.normalize(sig,'rms',0.5); var s2=0; for(var i=0;i<rm.length;i++) s2+=rm[i]*rm[i]; var r=Math.sqrt(s2/rm.length);
ok('rms', Math.abs(r-0.5)<1e-6);
ok('len', A.normalize([1,2,3],'peak',1).length===3);
var b=A.wavEncode([0,0.5,-0.5],44100); var u8=new Uint8Array(b);
ok('wav', String.fromCharCode(u8[0],u8[1],u8[2],u8[3])==='RIFF' && b.byteLength===44+3*2);
console.log('NormalizeForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
