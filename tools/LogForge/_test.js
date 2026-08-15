
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('log2',Math.abs(A.logBase(8,2)-3)<1e-12);
ok('log10',Math.abs(A.lg(100)-2)<1e-12);
ok('ln',Math.abs(A.ln(Math.E)-1)<1e-12);
ok('ln2',Math.abs(A.ln(2)-Math.log(2))<1e-12);
ok('pow',Math.abs(A.powerRule(2,3)-Math.log(8))<1e-12);
ok('err',A.logBase(-1,2)===null);
ok('base1',A.logBase(8,1)===null);
console.log('LogForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
