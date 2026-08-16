
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('full', A.gcs(4,5,6).total===15 && A.gcs(4,5,6).classify==='轻度/正常');
ok('severe', A.gcs(1,1,1).classify==='重度');
ok('mod', A.classify(10)==='中度');
ok('err', !!A.gcs(5,5,5).error);
console.log('GlasgowForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
