
const fs = require('fs'), path = require('path');
const html = fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
const mod = {exports:{}};
new Function('module','exports','require', m[1])(mod, mod.exports, require);
const P = mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }

var b1 = P.bdInit(30, 640, 400, 42), b2 = P.bdInit(30, 640, 400, 42);
ok(JSON.stringify(b1) === JSON.stringify(b2), 'deterministic init by seed');
ok(b1.length === 30, 'boid count');
var inb = b1.every(function(b){ return b.x >= 0 && b.x < 640 && b.y >= 0 && b.y < 400; });
ok(inb, 'init positions in bounds');
var cfg = { sep:1.5, ali:1, coh:1, radius:60, maxV:3.2 };
var s1 = P.bdStep(b1, 640, 400, cfg);
ok(s1.length === 30, 'step preserves count');
ok(JSON.stringify(P.bdStep(b1, 640, 400, cfg)) === JSON.stringify(s1), 'step deterministic');
var inb2 = s1.every(function(b){ return b.x >= 0 && b.x < 640 && b.y >= 0 && b.y < 400; });
ok(inb2, 'wrap keeps in bounds');
var vok = s1.every(function(b){ var sp = Math.sqrt(b.vx*b.vx+b.vy*b.vy); return sp <= 3.2001 && sp >= 0.999; });
ok(vok, 'speed clamped to [1, maxV]');
// cohesion pulls two nearby boids together
var pair = [{x:100,y:100,vx:1,vy:0},{x:140,y:100,vx:1,vy:0}];
var st = pair;
for(var i=0;i<40;i++) st = P.bdStep(st, 640, 400, { sep:0, ali:0, coh:2, radius:80, maxV:3.2 });
var d0 = 40, d1 = Math.abs(st[0].x - st[1].x);
ok(d1 < d0, 'cohesion reduces distance');
// separation pushes very close boids apart (distance grows after one step)
var close = [{x:100,y:100,vx:1,vy:0},{x:104,y:100,vx:1,vy:0}];
var st2 = P.bdStep(close, 640, 400, { sep:3, ali:0, coh:0, radius:60, maxV:3.2 });
var dBefore = 4, dAfter = Math.abs(st2[1].x - st2[0].x);
ok(dAfter > dBefore, 'separation increases distance');
console.log('PASS '+n+' assertions');
