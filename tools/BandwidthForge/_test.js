
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('bytes',A.toBytes(1,'GB')===1073741824);
ok('rate',A.rateToBps(1,'Gbps')===1000000000);
ok('est',typeof A.estimate(100,'MB','100','Mbps')==='string');
ok('est0',A.estimate(100,'MB',0,'Mbps')===null);
ok('estBig',typeof A.estimate(1,'TB','100','MBps')==='string');
console.log('BandwidthForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
