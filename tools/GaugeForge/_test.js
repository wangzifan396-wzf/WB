
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('svg', A.gaugeSvg(50,0,100).svg.indexOf('<svg')>=0);
ok('dash', A.gaugeSvg(50,0,100).svg.indexOf('stroke-dasharray')>=0);
ok('clamp', A.gaugeSvg(150,0,100).svg.indexOf('<svg')>=0);
ok('zero', A.gaugeSvg(0,0,100).svg.indexOf('<svg')>=0);
console.log('GaugeForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
