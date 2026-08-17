
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var v2=A.vennSvg([{label:'A',size:5},{label:'B',size:5}]); ok('2circ', (v2.svg.match(/<circle/g)||[]).length===2);
var v3=A.vennSvg([{label:'A',size:5},{label:'B',size:5},{label:'C',size:5}]); ok('3circ', (v3.svg.match(/<circle/g)||[]).length===3);
ok('err', !!A.vennSvg([{label:'A',size:5}]).error);
ok('errsize', !!A.vennSvg([{label:'A',size:0},{label:'B',size:5}]).error);
console.log('VennForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
