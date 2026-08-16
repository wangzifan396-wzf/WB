
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('black', A.lerpHex('#000000','#ffffff',0)==='#000000');
ok('white', A.lerpHex('#000000','#ffffff',1)==='#ffffff');
ok('mid', A.lerpHex('#ff0000','#0000ff',0.5)==='#800080');
ok('shorthex', A.hexToRgb('#fff')[0]===255);
ok('stops', A.gradientStops('#ff0000','#0000ff',3).length===3 && A.gradientStops('#ff0000','#0000ff',3)[1]==='#800080');
console.log('GradientTextForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
