
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('add',A.add(5,3)===8);
ok('sub',A.sub(5,3)===2);
ok('div0',A.div(5,0)===null);
ok('place',JSON.stringify(A.placeValue(1234))===JSON.stringify([1,2,3,4]));
console.log('AbacusForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
