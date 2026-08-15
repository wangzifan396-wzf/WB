
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var v=A.pick(rngFactory(5));ok('pick',v&&v.base&&v.past&&v.pp);
var goV=A.VERBS.filter(function(x){return x.base==='go';})[0];ok('check ok',A.check(goV,'past','went')===true);
ok('check no',A.check(goV,'pp','went')===false);
console.log('ConjugateForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
