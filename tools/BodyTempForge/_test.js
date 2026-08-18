
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('normal', A.bodyTemp(37).level==='正常');
ok('high', A.bodyTemp(39).level==='高热');
ok('fever', A.bodyTemp(38.5).level==='发热');
ok('infant', A.bodyTemp(38,2).level!=='正常');
ok('err', !!A.bodyTemp('x').error);
console.log('BodyTempForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
