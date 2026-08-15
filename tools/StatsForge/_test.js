
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var a=[1,2,3,4];
ok('mean',A.mean(a)===2.5);
ok('median',A.median(a)===2.5);
ok('median3',A.median([1,2,3])===2);
ok('mode',A.mode([1,1,2,3]).join(',')==='1');
ok('var',A.variance([2,4,4,4,5,5,7,9])===4);
ok('std',A.std([2,4,4,4,5,5,7,9])===2);
ok('range',A.rangeArr([1,9])===8);
ok('desc',A.describe([1,2,3]).count===3);
console.log('StatsForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
