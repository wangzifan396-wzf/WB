
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('normal', A.classify(98).level==='正常' && A.classify(98).needsSupplement===false);
ok('mild', A.classify(92).level==='轻度低氧');
ok('mod', A.classify(88).level==='中度低氧');
ok('sev', A.classify(80).level==='重度低氧' && A.classify(80).needsSupplement===true);
ok('err', !!A.classify(0).error);
console.log('Spo2Forge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
