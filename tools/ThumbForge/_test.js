
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('big',JSON.stringify(A.thumbDims(4000,3000,500))===JSON.stringify({w:500,h:375}));
ok('small',JSON.stringify(A.thumbDims(100,80,500))===JSON.stringify({w:100,h:80}));
ok('bad',A.thumbDims(0,0,500)===null);
console.log('ThumbForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
