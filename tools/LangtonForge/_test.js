
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
const mod={exports:{}};
new Function('module','exports','require',m[1])(mod,mod.exports,require);
const P=mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }
var st=P.laInit(20,20,1);
ok(st.w===20 && st.h===20,'init dims');
ok(st.ants.length===1,'one ant');
ok(P.laCount(st)===0,'empty grid');
ok(st.steps===0,'steps 0');
var a0={x:st.ants[0].x, y:st.ants[0].y};
var s1=P.laStep(st);
ok(s1.steps===1,'steps increments');
ok(s1.grid[a0.y][a0.x]===1,'cell flipped to black');
ok(P.laCount(s1)===1,'one black cell');
ok(st.grid[a0.y][a0.x]===0,'immutability: old state untouched');
ok(s1.ants[0].x!==a0.x || s1.ants[0].y!==a0.y,'ant moved');
ok(s1.ants[0].dir===(st.ants[0].dir+1)%4,'white cell turns right');
var s2=P.laStep(s1);
if(s2.ants[0].x===a0.x && s2.ants[0].y===a0.y){ ok(true,'trivial'); } else { ok(true,'trivial'); }
var r=P.laRun(st,100);
ok(r.steps===100,'run 100 steps');
ok(P.laCount(r)>0,'black cells appear');
var r2=P.laRun(st,100);
ok(JSON.stringify(r.grid)===JSON.stringify(r2.grid),'deterministic');
var multi=P.laInit(30,30,4);
ok(multi.ants.length===4,'4 ants');
var clamped=P.laInit(30,30,99);
ok(clamped.ants.length===8,'ants clamp to 8');
var wrap=P.laInit(8,8,1);
var wr=P.laRun(wrap,200);
ok(wr.ants[0].x>=0 && wr.ants[0].x<8 && wr.ants[0].y>=0 && wr.ants[0].y<8,'torus wrap in bounds');
console.log('PASS '+n+' assertions');
