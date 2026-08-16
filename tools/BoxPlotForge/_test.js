
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r=A.boxStats([1,2,3,4,5,6,7,8,9]);
ok('median', Math.abs(r.median-5)<1e-9);
ok('q1', Math.abs(r.q1-2.5)<1e-9);
ok('q3', Math.abs(r.q3-7.5)<1e-9);
ok('iqr', Math.abs(r.iqr-5)<1e-9);
ok('min', r.min===1 && r.max===9);
var r2=A.boxStats([1,2,3,4,5,6,7,8,9,10,100]);
ok('outlier', r2.outliers.indexOf(100)>=0);
ok('wlow', r2.whiskerLow===1 && r2.whiskerHigh===10);
ok('empty', !!A.boxStats([]).error);
console.log('BoxPlotForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
