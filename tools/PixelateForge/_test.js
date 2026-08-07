
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var src=new Uint8ClampedArray([255,0,0,255, 0,255,0,255, 0,0,255,255, 255,255,255,255]);
var out=A.pixelate(src,2,2,2);
ok('out length matches', out.length===16);
ok('block2 averages to 128', out[0]===128 && out[1]===128 && out[2]===128 && out[3]===255);
var same=A.pixelate(src,2,2,1); ok('block1 identity', same[0]===255 && same[4]===0);
console.log('PixelateForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
