
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('r0', A.sipFuture(1000,0,10,0).fv===120000);
ok('invested', A.sipFuture(1000,8,10,0).invested===120000);
ok('gain', A.sipFuture(1000,8,10,0).gain>60000);
ok('init', A.sipFuture(0,8,10,5000).fv>=5000);
ok('err', !!A.sipFuture(-1,8,10).error);
console.log('SipForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
