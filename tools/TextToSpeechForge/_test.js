
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('units',A.countUnits('Hello 世界').words===1 && A.countUnits('Hello 世界').cjk===2);
ok('est',A.estimateSeconds('word word',200)===Math.round((2/200)*60));
ok('estNull',A.estimateSeconds('x',0)===null);
ok('sent',A.splitSentences('Hello. World! 你好？').length===3);
console.log('TextToSpeechForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
