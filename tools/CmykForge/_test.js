
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('black', (function(){var c=A.rgbToCmyk(0,0,0); return c.c===0&&c.m===0&&c.y===0&&c.k===100;})());
ok('white', (function(){var c=A.rgbToCmyk(255,255,255); return c.c===0&&c.m===0&&c.y===0&&c.k===0;})());
ok('red', (function(){var c=A.rgbToCmyk(255,0,0); return c.c===0&&c.m===100&&c.y===100&&c.k===0;})());
ok('toRgb', (function(){var r=A.cmykToRgb(0,100,100,0); return r.r===255&&r.g===0&&r.b===0;})());
ok('rt', (function(){var t=A.rgbToCmyk(123,200,50); var b=A.cmykToRgb(t.c,t.m,t.y,t.k); return Math.abs(b.r-123)<=3&&Math.abs(b.g-200)<=3&&Math.abs(b.b-50)<=3;})());
console.log('CmykForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
