
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('basic', A.repeat('ab',3,'-')==='ab-ab-ab');
ok('zero', A.repeat('x',0,'')==='');
ok('empty', A.repeat('',5,'')==='');
ok('nosep', A.repeat('ha',2,'')==='haha');
ok('err', !!A.repeat('a',-1,'').error);
ok('nan', !!A.repeat('a','x','').error);
console.log('TextRepeatForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
