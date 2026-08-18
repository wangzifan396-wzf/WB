
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('calc', A.anionGap(140,100,24).ag===16);
ok('high', A.anionGap(140,90,18).ag===32 && A.anionGap(140,90,18).interp.indexOf('升高')>=0);
ok('low', A.anionGap(140,110,30).ag===0 && A.anionGap(140,110,30).interp.indexOf('降低')>=0);
ok('err', !!A.anionGap('x',100,24).error);
console.log('AnionGapForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
