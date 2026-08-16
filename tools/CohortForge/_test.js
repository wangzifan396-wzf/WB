
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var d=A.parseCohorts('100,50\n200,80'); ok('rows', d.length===2);
ok('parse', d[0][0]===100 && d[0][1]===50);
var r=A.retention(d); ok('ret', Math.abs(r[0][1]-0.5)<1e-9 && Math.abs(r[1][1]-0.4)<1e-9);
console.log('CohortForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
