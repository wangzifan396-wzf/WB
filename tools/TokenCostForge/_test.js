
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('models', A.list().length>=12);
ok('gpt', Math.abs(A.cost('GPT-4o',1000000,1000000)-(2.5+10))<1e-9);
ok('zero', A.cost('GPT-4o',0,0)===0);
ok('unknown', A.cost('NoSuchModel',100,100)===null);
console.log('TokenCostForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
