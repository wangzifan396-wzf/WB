
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var l=A.addItem([],'买菜'); l=A.addItem(l,'写代码');
ok('add',l.length===2 && l[0].text==='买菜' && l[0].done===false);
l=A.toggle(l,l[0].id);
ok('toggle',l[0].done===true);
l=A.remove(l,l[1].id);
ok('remove',l.length===1 && l[0].text==='买菜');
ok('filter',A.filter(l,'done').length===1 && A.filter(l,'active').length===0);
console.log('TodoForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
