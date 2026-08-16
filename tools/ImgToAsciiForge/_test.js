
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var grid=[]; for(var y=0;y<4;y++){var row=[];for(var x=0;x<4;x++)row.push({r:255,g:255,b:255});grid.push(row);}
function getPx(x,y){return grid[y][x];}
var art=A.toAscii(4,4,getPx,4,false);
ok('nonnull',typeof art==='string' && art.length>0);
ok('lines',art.split('\n').length===2);
ok('ramp',A.RAMP.length===10);
console.log('ImgToAsciiForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
