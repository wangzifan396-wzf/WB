
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('nth0', A.nthTriangular(0).value===0);
ok('nth6', A.nthTriangular(6).value===21);
ok('tri10', A.isTriangular(10).isTriangular===true && A.isTriangular(10).k===4);
ok('tri11', A.isTriangular(11).isTriangular===false);
console.log('TriangularForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
