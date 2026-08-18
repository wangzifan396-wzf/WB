
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('translate', A.transformCss({tx:10,ty:20}).css==='transform: translate(10px, 20px);');
ok('rotate', A.transformCss({rot:45}).css==='transform: rotate(45deg);');
ok('scale', A.transformCss({sx:2,sy:3}).css==='transform: scale(2, 3);');
ok('none', A.transformCss({}).css==='transform: none;');
console.log('TransformForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
