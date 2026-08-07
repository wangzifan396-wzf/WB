
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var g1=A.tileGeometry(100,100,2,2); ok('2x2 tiles', g1.tw===50 && g1.th===50 && g1.tiles.length===4);
var g2=A.tileGeometry(100,100,4,1); ok('4x1 tiles', g2.tiles.length===4 && g2.tw===25);
ok('tile index correct', g1.tiles[3].x===50 && g1.tiles[3].y===50);
console.log('SpriteForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
