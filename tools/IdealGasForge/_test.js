
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('pv',Math.abs(A.solve({p:101325,n:1,t:273.15}).v-0.022414)<1e-4);
ok('vp',Math.abs(A.solve({v:0.022414,n:1,t:273.15}).p-101325)<1);
ok('nt',Math.abs(A.solve({p:101325,v:0.022414,t:273.15}).n-1)<1e-3);
ok('tp',Math.abs(A.solve({p:101325,v:0.022414,n:1}).t-273.15)<1e-2);
ok('err',A.solve({p:1}).error!==undefined);
console.log('IdealGasForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
