
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var p=A.softmax([1,2,3]);
ok('sum',Math.abs(p.reduce(function(a,b){return a+b;},0)-1)<1e-9);
ok('argmax',A.topK([1,2,3],1)[0]===2);
ok('topp',typeof A.topP([1,2,3],0.9,rngFactory(3))==='number');
console.log('SoftmaxForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
