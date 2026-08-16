
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('kb',A.convert(1,'KB','B')===1000);
ok('kib',A.convert(1,'KiB','B')===1024);
ok('round',Math.abs(A.convert(1,'MB','KB')-1000)<1e-9);
ok('bad',A.convert(1,'XX','B')===null);
ok('human1000',A.toHuman(1536,1000)==='1.54 KB');
ok('human1024',A.toHuman(1536,1024)==='1.5 KiB');
console.log('ByteForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
