
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('hex',JSON.stringify(A.hexToRgb('#ff0000'))===JSON.stringify({r:255,g:0,b:0}));
ok('hex3',JSON.stringify(A.hexToRgb('#f00'))===JSON.stringify({r:255,g:0,b:0}));
ok('tohex',A.rgbToHex(255,0,0)==='#ff0000');
ok('rgbhsl',JSON.stringify(A.rgbToHsl(255,0,0))===JSON.stringify({h:0,s:100,l:50}));
ok('hslrgb',JSON.stringify(A.hslToRgb(0,100,50))===JSON.stringify({r:255,g:0,b:0}));
ok('nullhex',A.hexToRgb('xyz')===null);
console.log('RgbForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
