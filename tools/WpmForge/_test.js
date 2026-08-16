
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r=A.metrics('abc','abc',12);
ok('wpm',Math.abs(r.wpm-3)<1e-9 && r.accuracy===1);
var r2=A.metrics('abx','abc',12);
ok('acc',Math.abs(r2.accuracy-2/3)<1e-9);
ok('zero',A.metrics('abc','abc',0)===null);
console.log('WpmForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
