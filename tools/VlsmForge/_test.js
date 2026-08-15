
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r=A.vlsm('192.168.0.0',24,[50,20,10]);
ok('vlen',r.subnets&&r.subnets.length===3);
ok('vp0',r.subnets[0].prefix===26);
ok('vp1',r.subnets[1].prefix===27);
ok('vp2',r.subnets[2].prefix===28);
ok('vnet',r.subnets[0].network==='192.168.0.0');
var r2=A.vlsm('192.168.0.0',24,[200]);ok('vbig',r2.subnets&&r2.subnets[0].prefix===24);
ok('verr',A.vlsm('1.1.1.1',33,[10]).error!==undefined);
console.log('VlsmForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
