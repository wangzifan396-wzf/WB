
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('cdf0', Math.abs(A.normCdf(0)-0.5)<1e-6);
ok('median', (function(){var r=A.percentile('boy',0,3.3); return Math.abs(r.pct-50)<1;})());
ok('plus1sd', (function(){var r=A.percentile('boy',0,3.7); return r.pct>80 && r.pct<90;})());
ok('high', (function(){var r=A.percentile('girl',12,12); return r.pct>97;})());
ok('err', !!A.percentile('boy',99,3).error);
ok('err2', !!A.percentile('boy',-1,3).error);
console.log('BabyGrowthForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
