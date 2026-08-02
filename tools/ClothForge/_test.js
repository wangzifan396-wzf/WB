
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
const mod={exports:{}};
new Function('module','exports','require',m[1])(mod,mod.exports,require);
const P=mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }
var s=P.clInit(5,4,20,0,0);
ok(s.pts.length===20,'point count');
ok(s.cons.length===5*4-5 + 4*5-4,'constraint count');
var pinned=s.pts.filter(function(p){return p.pin;}).length;
ok(pinned>0,'some pinned top points');
var s1=P.clStep(s, 0.25, 0.99, 3);
ok(s1.pts.length===20,'step preserves count');
ok(JSON.stringify(P.clStep(s,0.25,0.99,3))===JSON.stringify(s1),'step deterministic');
var nan=s1.pts.some(function(p){ return !isFinite(p.x)||!isFinite(p.y); });
ok(!nan,'no NaN after step');
var pin0=s.pts.filter(function(p){return p.pin;});
var top=s1.pts.filter(function(p){return p.pin;});
ok(top.every(function(p,idx){ return p.x===pin0[idx].x && p.y===pin0[idx].y; }),'pinned stay at init position');
// constraint length approx spacing after iterations
var maxErr=0;
for(var c=0;c<s.cons.length;c++){ var a=s.cons[c][0], b=s.cons[c][1]; var pa=s1.pts[a], pb=s1.pts[b]; var d=Math.sqrt((pb.x-pa.x)*(pb.x-pa.x)+(pb.y-pa.y)*(pb.y-pa.y)); maxErr=Math.max(maxErr, Math.abs(d-20)); }
ok(maxErr<4,'constraints near rest length');
// gravity makes bottom row drop below start
var last=s.pts.length-1; var bottomBefore=s.pts[last].y, bottomAfter=s1.pts[last].y;
ok(bottomAfter>bottomBefore,'gravity pulls cloth down');
console.log('PASS '+n+' assertions');
