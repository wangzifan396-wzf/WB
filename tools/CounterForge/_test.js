
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var l=A.addCounter([],'步数'); l=A.inc(l,l[0].id,10); l=A.inc(l,l[0].id,5);
ok('inc',l[0].count===15);
l=A.dec(l,l[0].id,3); ok('dec',l[0].count===12);
l=A.dec(l,l[0].id,100); ok('floor',l[0].count===0);
l=A.reset(l,l[0].id); ok('reset',l[0].count===0);
var l2=A.addCounter(l,'圈'); ok('total',A.total(l2)===0);
l2=A.remove(l2,l2[0].id); ok('remove',l2.length===1);
console.log('CounterForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
