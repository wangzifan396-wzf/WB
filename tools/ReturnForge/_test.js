
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('roi',A.roi(1000,1200)===0.2);
ok('roiNeg',A.roi(1000,800)===-0.2);
ok('pb',A.paybackPeriod(1000,100)===10);
ok('be',A.breakEven(1000,10,6)===250);
ok('margin',A.margin(100,60)===0.4);
ok('roiErr',A.roi(0,5)===null);
console.log('ReturnForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
