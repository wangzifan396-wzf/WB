
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
const mod={exports:{}};
new Function('module','exports','require',m[1])(mod,mod.exports,require);
const P=mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }
var r1=P.tmSquarify([1,1,1,1], 0,0,100,100);
ok(r1.length===4,'4 rects');
var area1=P.tmAreaSum(r1);
ok(Math.abs(area1-10000)<=50,'area ~10000 got '+area1);
ok(r1.every(function(x){return x.w>0&&x.h>0;}),'positive dims');
var r2=P.tmSquarify([10,1,1], 0,0,100,100);
ok(r2.length===3 && P.tmAreaSum(r2)>9800,'weighted rects');
ok(P.tmSquarify([0,0,0],0,0,100,100).length===0,'zero values empty');
ok(P.tmSquarify([5,5],0,0,0,100).length===0,'zero w/h empty');
ok(P.tmSquarify([],0,0,100,100).length===0,'empty input');
var r3=P.tmSquarify([3,3,3,3,3,3,3,3],0,0,200,200);
ok(r3.length===8 && Math.abs(P.tmAreaSum(r3)-40000)<=120,'8 even rects cover');
ok(r3.every(function(x){return x.x>=0&&x.y>=0&&x.x+x.w<=200.5&&x.y+x.h<=200.5;}),'within bounds');
var r4=P.tmSquarify([100,1,1,1,1,1,1,1,1,1],0,0,100,100);
ok(r4.length===10,'many items');
ok(r4.every(function(x){return isFinite(x.w)&&isFinite(x.h);}),'finite');
console.log('PASS '+n+' assertions');
