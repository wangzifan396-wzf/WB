
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var l=A.add([],'buy milk','#fff7a8'); ok('add',l.length===1 && l[0].color==='#fff7a8');
var l2=A.add(l,'',''); ok('skip',l2.length===1);
var u=A.update(l,'x','new'); ok('updateNop',u.length===1);
l=A.update(l,l[0].id,'new text'); ok('update',l[0].text==='new text');
l=A.remove(l,l[0].id); ok('remove',l.length===0);
console.log('StickyNoteForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
