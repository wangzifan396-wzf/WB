
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('pool',A.poolSize('abc')===26 && A.poolSize('aA1!')===(26+26+10+A.SYM.length));
var expEnt=Math.round(4*Math.log2(26)*10)/10;
ok('ent',A.estimate('aaaa').entropy===expEnt);
ok('ratingWeak',A.estimate('aaaa').rating==='极弱');
ok('ratingStrong',A.estimate('Tr0ub4dour&3').rating!=='极弱');
ok('empty',A.estimate('').entropy===0);
console.log('EntropyForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
