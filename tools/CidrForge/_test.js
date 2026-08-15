
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('net',A.cidrInfo('192.168.1.10',24).network==='192.168.1.0');
ok('bcast',A.cidrInfo('192.168.1.10',24).broadcast==='192.168.1.255');
ok('mask',A.cidrInfo('192.168.1.10',24).mask==='255.255.255.0');
ok('hosts',A.cidrInfo('192.168.1.10',24).hosts===254);
ok('b8',A.cidrInfo('10.0.0.0',8).network==='10.0.0.0'&&A.cidrInfo('10.0.0.0',8).hosts===16777214);
ok('invalid',A.cidrInfo('1.1.1.1',33)===null);
console.log('CidrForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
