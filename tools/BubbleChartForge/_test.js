
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('svg', A.bubbleSvg([{x:1,y:1,size:5,label:'a'},{x:2,y:3,size:10,label:'b'}]).svg.indexOf('<svg')>=0);
ok('n', A.bubbleSvg([{x:1,y:1,size:5},{x:2,y:3,size:10}]).n===2);
ok('circles', (A.bubbleSvg([{x:1,y:1,size:5},{x:2,y:3,size:10}]).svg.match(/<circle/g)||[]).length===2);
ok('err', !!A.bubbleSvg([]).error);
ok('errval', !!A.bubbleSvg([{x:1,y:'x',size:5}]).error);
console.log('BubbleChartForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
