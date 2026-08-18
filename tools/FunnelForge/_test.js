
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('svg', A.funnelSvg([{label:'A',value:100},{label:'B',value:60},{label:'C',value:30}]).svg.indexOf('<svg')>=0);
ok('n', A.funnelSvg([{label:'A',value:100},{label:'B',value:60},{label:'C',value:30}]).n===3);
ok('paths', (A.funnelSvg([{label:'A',value:100},{label:'B',value:60}]).svg.match(/<path/g)||[]).length===2);
ok('err', !!A.funnelSvg([{label:'A',value:100}]).error);
console.log('FunnelForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
