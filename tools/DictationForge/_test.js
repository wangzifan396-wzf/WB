
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var s=A.pick(rngFactory(3),5);ok('len',s.length===5);
var s2=A.pick(rngFactory(3),5);ok('deterministic',JSON.stringify(s)===JSON.stringify(s2));
var up=s.map(function(w){return w.w.toUpperCase();});ok('score',A.score(up,s).correct===5);
var ans2=s.map(function(w,i){return i===0?'WRONG':w.w;});ok('case',A.score(ans2,s).correct===4&&A.score(ans2,s).total===5);
console.log('DictationForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
