
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('c52',A.binomial(5,2)===10);
ok('c50',A.binomial(5,0)===1);
ok('c55',A.binomial(5,5)===1);
ok('c70',A.binomial(7,0)===1);
ok('row4',A.row(4).join(',')==='1,4,6,4,1');
ok('tri',A.triangle(3).length===4);
ok('cErr',A.binomial(5,6)===0);
console.log('PascalForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
