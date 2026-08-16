
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('count', A.generate(10,'x').length===10);
ok('repro', JSON.stringify(A.generate(5,'seed1'))===JSON.stringify(A.generate(5,'seed1')));
ok('diff', JSON.stringify(A.generate(5,'seed1'))!==JSON.stringify(A.generate(5,'seed2')));
ok('fmt', /^[A-Z2-9]{4}-[A-Z2-9]{4}$/.test(A.code(rngFactory(1))));
console.log('BackupCodeForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
