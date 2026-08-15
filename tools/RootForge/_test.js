
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('sq',A.sqRoot(9)===3);
ok('cb',A.cbRoot(8)===2);
ok('n4',Math.abs(A.nthRoot(16,4)-2)<1e-12);
ok('negodd',A.nthRoot(-8,3)===-2);
ok('negeven',A.nthRoot(-4,2)===null);
ok('sqerr',A.sqRoot(-1)===null);
ok('nerr',A.nthRoot(9,0)===null);
console.log('RootForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
