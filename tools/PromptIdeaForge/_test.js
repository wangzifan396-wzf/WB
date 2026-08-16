
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var g=A.generate(rngFactory(1));
ok('nonempty',typeof g==='string' && g.length>0);
ok('role',g.indexOf('角色：')>=0);
ok('det',A.generate(rngFactory(2)).indexOf('任务：')>=0);
console.log('PromptIdeaForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
