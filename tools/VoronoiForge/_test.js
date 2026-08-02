
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
const mod={exports:{}};
new Function('module','exports','require',m[1])(mod,mod.exports,require);
const P=mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }
var sites=[{x:10,y:10},{x:100,y:100}];
ok(P.vNearest(sites,10,10)===0,'nearest to site0');
ok(P.vNearest(sites,100,100)===1,'nearest to site1');
ok(P.vNearest(sites,60,60)===1,'far tie -> site1');
ok(P.vNearest(sites,55,55)===0,'near tie -> site0');
ok(P.vNearest(sites,-5,-5)===0,'out of range clamps to site0');
ok(P.vNearest([],5,5)===-1,'empty sites -> -1');
var g=P.vGrid(sites,200,200,10);
ok(g.length===20,'grid rows');
ok(g[0].length===20,'grid cols');
ok(g[0][0]===0,'grid(0,0)=site0');
ok(g[0][19]===1,'grid(19,0)=site1');
var c=P.vColors(5);
ok(c.length===5,'color count');
ok(/hsl\(0,/.test(c[0]),'color0 red');
ok(/hsl\(288,/.test(c[4]),'color4 wrap');
var c2=P.vColors(5);
ok(JSON.stringify(c)===JSON.stringify(c2),'colors deterministic');
console.log('PASS '+n+' assertions');
