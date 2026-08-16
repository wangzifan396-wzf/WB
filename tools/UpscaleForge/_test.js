
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('len', A.nearestMap(4,4,2,2).length===16);
ok('mapval', (function(){var mp=A.nearestMap(2,2,2,2); return mp.indexOf(0)>=0 && mp.indexOf(3)>=0 && mp.length===4;})());
ok('bilinear', A.bilinearMap(2,2,2,2).length===4);
ok('oob', (function(){var mp=A.nearestMap(3,3,2,2); return mp.every(function(v){return v>=0 && v<4;});})());
console.log('UpscaleForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
