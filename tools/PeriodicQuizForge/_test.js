
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var q=A.ask(rngFactory(1));
ok('inpool', A.ELEMENTS.some(function(e){return e.name===q.answer||e.sym===q.answer||e.num===q.answer;}));
ok('checkok', A.check(q,q.answer)===true);
ok('checkno', A.check(q,'__definitely_wrong__')===false);
ok('qtype', ['符号→名称','名称→符号','序数→名称'].indexOf(q.type)>=0);
console.log('PeriodicQuizForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
