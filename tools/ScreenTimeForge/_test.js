
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('avg', A.avg([{day:'1',m:60},{day:'2',m:120}])===90);
var big=[]; for(var i=1;i<=10;i++) big.push({day:'2026-08-'+i,m:100});
ok('last7', A.last7(big).length===7);
ok('total', A.total([{day:'1',m:60},{day:'2',m:120}])===180);
ok('sum', A.summarize([{day:'1',m:60}]).days===1);
console.log('ScreenTimeForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
