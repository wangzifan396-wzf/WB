
const fs = require('fs'), path = require('path');
const html = fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
const mod = {exports:{}};
new Function('module','exports','require', m[1])(mod, mod.exports, require);
const P = mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }

var G=9.81, L=1, M=1;
// equilibrium: hanging straight down, zero velocity -> zero derivatives
var eq = P.dpDeriv([0,0,0,0], G, L, L, M, M);
ok(eq.every(function(v){ return Math.abs(v) < 1e-12; }), 'equilibrium is stationary');
// determinism
var s0 = [2.0, 0, 1.0, 0], a = s0, b = s0;
for(var i=0;i<100;i++){ a = P.dpRk4(a, 0.01, G, L, L, M, M); b = P.dpRk4(b, 0.01, G, L, L, M, M); }
ok(JSON.stringify(a) === JSON.stringify(b), 'RK4 deterministic');
// energy conservation over 1000 steps (RK4 dt=0.005 should drift < 1%)
var s = [2.0, 0, 1.0, 0];
var e0 = P.dpEnergy(s, G, L, L, M, M);
for(var i=0;i<1000;i++) s = P.dpRk4(s, 0.005, G, L, L, M, M);
var e1 = P.dpEnergy(s, G, L, L, M, M);
ok(Math.abs(e1 - e0) / Math.abs(e0) < 0.01, 'energy conserved within 1%');
// chaos: tiny perturbation diverges
var p1 = [2.0, 0, 1.0, 0], p2 = [2.0 + 1e-8, 0, 1.0, 0];
for(var i=0;i<4000;i++){ p1 = P.dpRk4(p1, 0.01, G, L, L, M, M); p2 = P.dpRk4(p2, 0.01, G, L, L, M, M); }
ok(Math.abs(p1[0] - p2[0]) > 1e-4, 'sensitive dependence on initial conditions');
// position geometry: rod lengths preserved
var pos = P.dpPos([0.7, 0, -0.3, 0], 1, 1);
var r1 = Math.sqrt(pos.x1*pos.x1 + pos.y1*pos.y1);
var r2 = Math.sqrt((pos.x2-pos.x1)*(pos.x2-pos.x1) + (pos.y2-pos.y1)*(pos.y2-pos.y1));
ok(Math.abs(r1 - 1) < 1e-9 && Math.abs(r2 - 1) < 1e-9, 'rod lengths preserved');
// small oscillation stays bounded
var sm = [0.1, 0, 0.1, 0];
var bounded = true;
for(var i=0;i<2000;i++){ sm = P.dpRk4(sm, 0.01, G, L, L, M, M); if(Math.abs(sm[0]) > 0.5) bounded = false; }
ok(bounded, 'small oscillation bounded');
console.log('PASS '+n+' assertions');
