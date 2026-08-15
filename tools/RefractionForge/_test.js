
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r1=A.snell(1,1.5,30);ok('snell',Math.abs(r1.theta2-19.4712)<1e-3);
ok('tir',A.snell(1.5,1,50).tir===true);
ok('crit',Math.abs(A.criticalAngle(1.5,1)-41.8103)<1e-3);
ok('critnull',A.criticalAngle(1,1.5)===null);
ok('err',A.snell(0,1.5,30)===null);
console.log('RefractionForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
