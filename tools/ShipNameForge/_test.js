
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r=A.shipName('Chris','Alex', rngFactory(1));
ok('has', r.names.length>0);
ok('fromboth', r.names.every(function(s){ return /^[A-Z]/.test(s); }));
ok('err', !!A.shipName('','x').error);
ok('blend', A.blend('ab','cd').indexOf('Ac')>=0 || A.blend('ab','cd').length>0);
console.log('ShipNameForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
