
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('tax0', A.taxBracket(1000,A.DEFAULT_BR)===0);
ok('tax1', Math.abs(A.taxBracket(10000,A.DEFAULT_BR)-210)<0.01);
ok('tax2', Math.abs(A.taxBracket(20000,A.DEFAULT_BR)-1070)<0.01);
ok('net', (function(){var p=A.payroll(20000,{insuranceRate:0.1,other:0}); return Math.abs(p.net-17130)<0.5;})());
ok('err', !!A.payroll(-1,{}).error);
console.log('PayrollForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
