
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('days',A.daysBetween('2026-08-15','2026-08-20')===5);
var p=A.plan(['数学','英语','物理'],6);ok('planLen',p.length===6);
ok('plan0',p[0].subject==='数学');ok('plan5',p[5].subject==='物理');
ok('planEmpty',A.plan([],3).length===0);
ok('cd',typeof A.countdown('2030-01-01')==='number');
console.log('StudyPlanForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
