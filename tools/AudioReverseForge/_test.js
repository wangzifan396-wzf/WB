
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('rev',JSON.stringify(A.reverse([1,2,3]))===JSON.stringify([3,2,1]));
ok('empty',A.reverse([]).length===0);
ok('inter',JSON.stringify(A.reverseInterleaved([0.1,0.2,0.3,0.4],2))===JSON.stringify([0.3,0.4,0.1,0.2]));
ok('bad',A.reverseInterleaved([1,2],0).length===0);
console.log('AudioReverseForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
