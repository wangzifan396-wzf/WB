
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('bmrM',Math.abs(A.bmr('m',80,180,30)-1780)<1e-6);
ok('bmrF',Math.abs(A.bmr('f',60,165,30)-1320.25)<1e-6);
ok('tdee',Math.abs(A.tdee('m',80,180,30,'sedentary')-1780*1.2)<1e-6);
ok('lvl',A.tdee('m',80,180,30,'light')===1780*1.375);
ok('err',A.bmr('m',0,180,30)===null);
console.log('MetabolismForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
