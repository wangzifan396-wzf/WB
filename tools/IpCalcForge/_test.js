
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r=A.calc('192.168.1.10',24);
ok('net',r.network==='192.168.1.0');
ok('bc',r.broadcast==='192.168.1.255');
ok('mask',r.mask==='255.255.255.0');
ok('usable',r.usable===254 && r.total===256);
ok('first',r.first==='192.168.1.1' && r.last==='192.168.1.254');
ok('bad',A.calc('999.1.1.1',24)===null);
console.log('IpCalcForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
