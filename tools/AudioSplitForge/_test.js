
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var sp=A.splitByDuration([1,2,3,4,5],1,2);
ok('seg',sp.length===3 && sp[0].length===2 && sp[2].length===1);
ok('bad',A.splitByDuration([],1,2).length===0);
var sil=A.findSilence([0.5,0.5,0,0,0.5],1,0.01,1);
ok('sil',sil.length===1 && sil[0][0]===2 && sil[0][1]===3);
console.log('AudioSplitForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
