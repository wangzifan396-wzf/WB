
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var pts = A.starPoints(50,50,40,5);
ok('star count', pts.length === 10);
ok('star first', pts[0][0] === 50 && Math.abs(pts[0][1] - 10) < 1);
ok('poly', A.polyPath([[0,0],[1,1]]).indexOf("M0 0L1 1Z") === 0);
console.log('StickerForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
