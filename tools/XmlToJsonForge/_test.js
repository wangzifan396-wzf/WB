
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r1=A.parseXml('<a><b>1</b><b>2</b></a>');
ok('arr',JSON.stringify(r1)===JSON.stringify({a:{b:['1','2']}}));
var r2=A.parseXml('<a x="1">hi</a>');
ok('attr',JSON.stringify(r2)===JSON.stringify({a:{'@attributes':{x:'1'},'#text':'hi'}}));
var r3=A.parseXml('<a><b><c>z</c></b></a>');
ok('nested',r3.a.b.c==='z');
var r4=A.parseXml('<a/>');
ok('selfclose',JSON.stringify(r4)===JSON.stringify({a:{}}));
console.log('XmlToJsonForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
