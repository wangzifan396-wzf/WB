
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('shadow', A.neuCss({distance:10}).indexOf('box-shadow')>=0);
ok('dual', A.neuCss({distance:10}).indexOf('-')>0);
ok('radius', A.neuCss({radius:20}).indexOf('border-radius: 20px')>=0);
ok('inten', A.neuCss({intensity:0.2}).indexOf('0.20')>=0);
console.log('NeumorphismForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
