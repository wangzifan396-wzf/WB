
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('count',A.E.length===118);
ok('bySym',A.bySym('Fe').mass===55.845 && A.bySym('Fe').zh==='铁');
ok('byNum',A.byNum(1).sym==='H' && A.byNum(8).zh==='氧');
ok('searchZh',A.search('氧').some(function(e){return e.sym==='O';}));
ok('searchNum',A.search('26')[0].sym==='Fe');
ok('cat',A.categoryOf('He')==='稀有气体' && A.categoryOf('Na')==='碱金属');
console.log('PeriodicForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
