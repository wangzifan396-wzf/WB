
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r=A.parseBlocks('09:00-10:00 A\n10:00-11:30 B');
ok('len', r.blocks.length===2);
ok('total', r.totalMinutes===150);
ok('label', r.blocks[1].label==='B');
ok('bad', A.parseBlocks('x').errors.length===1);
console.log('TimeBlockForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
