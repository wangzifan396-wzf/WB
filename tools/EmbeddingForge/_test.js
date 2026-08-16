
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('dim',A.vec('cat').length===16);
ok('ident',Math.abs(A.cosine(A.vec('cat'),A.vec('cat'))-1)<1e-9);
ok('range',(function(){var c=A.cosine(A.vec('cat'),A.vec('dog')); return c>=-1.0001 && c<=1.0001;})());
ok('empty',A.cosine([],[])<=0);
console.log('EmbeddingForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
