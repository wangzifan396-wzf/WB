
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var s=A.scale(16,1.5,4);
ok('len', s.length===4);
ok('first', s[0]===16);
ok('mono', s[3]>s[2] && s[2]>s[1]);
ok('ratio', Math.abs(s[1]-24)<0.01);
ok('ratios', A.RATIOS.golden>1.6);
console.log('TypeScaleForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
