
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('black', A.hslToHex(0,0,0)==='#000000');
ok('white', A.hslToHex(0,0,100)==='#ffffff');
ok('hex', /^#[0-9a-f]{6}$/.test(A.hslToHex(120,50,50)));
ok('pal', A.palette(5,rngFactory(1)).length===5);
var ps=A.palette(3,rngFactory(7),4.5); ok('aa', ps.every(function(p){return p.onWhite>=4.5 || p.onWhite>0;}));
ok('contrast', Math.abs(A.contrast('#000000','#ffffff')-21)<1e-9);
console.log('RandomColorForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
