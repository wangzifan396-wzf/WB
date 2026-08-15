
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var p=A.genProblem(rngFactory(3),1);ok('struct',typeof p.a==='number'&&/[\+\-×÷]/.test(p.q));
var set=A.genSet(rngFactory(9),8,2);ok('len',set.length===8);
var set2=A.genSet(rngFactory(9),8,2);ok('deterministic',JSON.stringify(set)===JSON.stringify(set2));
console.log('TimesTableForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
