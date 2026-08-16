
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var g=A.createGrid(4); ok('create', g.length===4 && g[0].length===4);
ok('set', A.setPixel(g,1,2,'#fff')===true);
ok('get', A.getPixel(g,1,2)==='#fff');
ok('oob', A.setPixel(g,9,9,'x')===false);
A.clearGrid(g,'#abc'); ok('clear', g[3][3]==='#abc' && g[0][0]==='#abc');
var g2=A.createGrid(2); g2[0][0]='r'; var g3=A.resizeGrid(g2,4); ok('resize', g3.length===4 && g3[0][0]==='r');
console.log('PixelArtForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
