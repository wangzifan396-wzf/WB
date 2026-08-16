
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('pos', A.analyze("I love this great happy product").score>0);
ok('neg', A.analyze("I hate this terrible bad product").score<0);
ok('neu', A.analyze("the cat sat on the mat").score===0);
ok('best', A.analyze("best").score===3);
ok('mix', A.analyze("good but awful").score===-2);
console.log('SentimentForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
