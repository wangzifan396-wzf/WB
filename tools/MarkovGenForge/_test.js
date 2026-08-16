
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }
var model=A.build('a b c a b c a b c',2);
ok('build',model && Object.keys(model.map).length>0);
var g=A.gen(model,rngFactory(1),6);
ok('gen',typeof g==='string' && g.split(' ').length>0);
ok('short',A.build('a b',2)===null);
console.log('MarkovGenForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
