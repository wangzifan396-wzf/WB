
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('backdrop', A.glassCss({blur:8}).indexOf('backdrop-filter')>=0);
ok('blurval', A.glassCss({blur:8}).indexOf('blur(8px)')>=0);
ok('alpha', A.glassCss({alpha:0.3}).indexOf('0.30')>=0);
ok('radius', A.glassCss({radius:20}).indexOf('border-radius: 20px')>=0);
console.log('GlassmorphismForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
