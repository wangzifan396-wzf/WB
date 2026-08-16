
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var l=A.add([],{title:'hi',lang:'js',code:'console.log(1)'}); ok('add',l.length===1 && l[0].lang==='js');
var l2=A.add(l,{title:'x'}); ok('skip',l2.length===1);
var f=A.search(l,'console'); ok('search',f.length===1);
var bl=A.byLang(l,'js'); ok('bylang',bl.length===1 && bl[0].lang==='js');
l=A.remove(l,l[0].id); ok('remove',l.length===0);
console.log('SnippetForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
