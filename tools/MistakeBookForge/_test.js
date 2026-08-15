
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var b=A.addEntry([],{q:'2+2',wrong:'3',correct:'4',tag:'加法'});ok('add',b.length===1&&b[0].tag==='加法');
var b2=A.addEntry(b,{q:'3×3',wrong:'6',correct:'9',tag:'乘法'});ok('add2',b2.length===2);
var s=A.summary(b2);ok('summary',s.total===2&&s.byTag['加法']===1&&s.byTag['乘法']===1);
ok('byTag',A.byTag(b2,'加法').length===1);
console.log('MistakeBookForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
