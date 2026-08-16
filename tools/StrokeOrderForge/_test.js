
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('one', JSON.stringify(A.strokes('一'))===JSON.stringify(['M12 50 H88']));
ok('three', A.strokes('三').length===3);
ok('wang', A.strokes('王').length===4);
ok('miss', A.strokes('XYZ')===null);
ok('size', Object.keys(A.STROKES).length>=16);
console.log('StrokeOrderForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
