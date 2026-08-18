
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('one', typeof A.petName('dog', rngFactory(2))==='string' && A.petName('dog', rngFactory(2)).length>=2);
ok('bulk', A.petNameBulk(5,'cat', rngFactory(3)).length===5);
ok('blank', typeof A.petName('', rngFactory(4))==='string');
console.log('PetNameForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
