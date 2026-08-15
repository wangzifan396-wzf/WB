
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('scale',JSON.stringify(A.computeDims(100,50,'scale',200))===JSON.stringify({w:200,h:100}));
ok('width',JSON.stringify(A.computeDims(100,50,'width',50))===JSON.stringify({w:50,h:25}));
ok('height',JSON.stringify(A.computeDims(100,50,'height',25))===JSON.stringify({w:50,h:25}));
ok('longest',JSON.stringify(A.computeDims(100,50,'longest',40))===JSON.stringify({w:40,h:20}));
ok('bad',A.computeDims(0,0,'scale',100)===null);
console.log('ResizeForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
