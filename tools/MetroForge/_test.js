
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('iv',A.intervalMs(120)===500);
ok('sub',A.subdivide(120,2)===250);
ok('name',A.tempoName(120)==='快板(Allegro)');
ok('slow',A.tempoName(50)==='慢板(Largo)');
ok('bad',A.intervalMs(0)===null);
console.log('MetroForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
