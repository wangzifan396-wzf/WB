
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('bmi',Math.abs(A.bmi(70,1.75)-22.857)<0.01);
ok('cat1',A.category(22)==='正常');
ok('cat2',A.category(17)==='偏瘦');
ok('cat3',A.category(26)==='超重');
ok('cat4',A.category(30)==='肥胖');
var rg=A.healthyRange(1.75);ok('range',Math.abs(rg.min-56.6)<0.5&&Math.abs(rg.max-73.2)<0.5);
console.log('BmiCalcForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
