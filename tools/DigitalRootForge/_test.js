
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('0', A.digitalRoot(0).value===0);
ok('9', A.digitalRoot(9).value===9);
ok('38', A.digitalRoot(38).value===2 && A.digitalRoot(38).steps===2);
ok('12345', A.digitalRoot(12345).value===6 && A.digitalRoot(12345).steps===2);
ok('err', !!A.digitalRoot('x').error);
console.log('DigitalRootForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
