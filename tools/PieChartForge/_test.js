
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var p=A.pieSvg([{label:'A',value:1},{label:'B',value:1}]); ok('n2', (p.svg.match(/<path/g)||[]).length===2);
ok('total', A.pieSvg([{label:'A',value:3},{label:'B',value:1}]).total===4);
ok('err', !!A.pieSvg([]).error);
ok('neg', !!A.pieSvg([{label:'A',value:-1}]).error);
console.log('PieChartForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
