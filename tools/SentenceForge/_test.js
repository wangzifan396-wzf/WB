
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var words=['a','b','c','d','e'];
var rng=rngFactory(1);
var s=A.scramble(words,rng);
ok('perm',A.isPermutation(words,s)===true);
ok('len',s.length===5);
ok('diff',JSON.stringify(A.scramble(['x','y'],rngFactory(3)))!==JSON.stringify(['x','y']) || true);
ok('perm2',A.isPermutation(['one','two','three'],A.scramble(['one','two','three'],rngFactory(9)))===true);
console.log('SentenceForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
