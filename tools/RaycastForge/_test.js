
const fs = require('fs'), path = require('path');
const html = fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
const mod = {exports:{}};
new Function('module','exports','require', m[1])(mod, mod.exports, require);
const P = mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }

ok(P.rcCell(P.RC_MAP, 0.5, 0.5) === 1, 'border is wall');
ok(P.rcCell(P.RC_MAP, 1.5, 1.5) === 0, 'interior is empty');
ok(P.rcCell(P.RC_MAP, -1, -1) === 1, 'out of bounds is wall');
// ray straight right from (1.5,1.5): interior 1..10 empty on row1, wall at x=11
var h = P.rcCast(P.RC_MAP, 1.5, 1.5, 0);
ok(Math.abs(h.dist - 9.5) < 0.01, 'distance to east wall');
ok(h.side === 0, 'east hit is x-side');
var h2 = P.rcCast(P.RC_MAP, 1.5, 1.5, Math.PI/2);
ok(Math.abs(h2.dist - 6.5) < 0.01, 'distance to south wall');
ok(h2.side === 1, 'south hit is y-side');
var f = P.rcFrame(P.RC_MAP, 2.5, 2.5, 0.3, 64, Math.PI/3);
ok(f.length === 64, 'frame column count');
ok(f.every(function(c){ return c.h > 0 && c.tile >= 1; }), 'all columns hit walls');
ok(JSON.stringify(P.rcFrame(P.RC_MAP, 2.5, 2.5, 0.3, 64, Math.PI/3)) === JSON.stringify(f), 'frame deterministic');
var mv = P.rcMove(P.RC_MAP, 1.5, 1.5, 0, 1);
ok(mv.x > 1.5 && mv.y === 1.5, 'move forward east');
var blocked = P.rcMove(P.RC_MAP, 1.2, 1.5, Math.PI, 1);
ok(blocked.x >= 1.0, 'wall blocks movement');
console.log('PASS '+n+' assertions');
