
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
function eq(n,g,e){if(g===e)pass++;else{fail++;console.error('FAIL '+n+': '+g);}}
var v=C.variants('the quick brown fox');
eq('title',v.titleCase,'The Quick Brown Fox');
eq('kebab',v.kebab,'the-quick-brown-fox');
eq('camel',v.camel,'theQuickBrownFox');
eq('pascal',v.pascal,'TheQuickBrownFox');
eq('sentence',v.sentenceCase,'The quick brown fox');
eq('upper',v.upper,'THE QUICK BROWN FOX');
console.log((fail?'FAIL':'PASS')+' TitleForge '+pass+'/'+fail);process.exit(fail?1:0);
