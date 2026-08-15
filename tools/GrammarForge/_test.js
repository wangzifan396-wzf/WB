
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var s=A.getSet(rngFactory(4),10);ok('len',s.length===10);
var s2=A.getSet(rngFactory(4),10);ok('deterministic',JSON.stringify(s)===JSON.stringify(s2));
var g=A.grade(s,[s[0].ans,s[1].ans,s[2].ans,s[3].ans,s[4].ans,s[5].ans,s[6].ans,s[7].ans,s[8].ans,s[9].ans]);ok('grade',g.correct===10&&g.total===10);
console.log('GrammarForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
