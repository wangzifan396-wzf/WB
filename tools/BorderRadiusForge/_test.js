
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('all', A.borderRadiusCss(10,10,10,10).shorthand==='10px');
ok('opp', A.borderRadiusCss(10,20,10,20).shorthand==='10px 20px');
ok('full', A.borderRadiusCss(10,20,30,40).shorthand==='10px 20px 30px 40px');
ok('err', !!A.borderRadiusCss(-1,10,10,10).error);
console.log('BorderRadiusForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
