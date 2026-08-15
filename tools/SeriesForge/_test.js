
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var a=A.arith(1,1,5);ok('arith sum',a.sum===15&&a.terms.length===5);
var g=A.geo(1,2,4);ok('geo terms',g.terms[0]===1&&g.terms[3]===8);
ok('geo sum',Math.abs(g.sum-15)<1e-6);
console.log('SeriesForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
