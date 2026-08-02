
const fs = require('fs'), path = require('path');
const html = fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
const mod = {exports:{}};
new Function('module','exports','require', m[1])(mod, mod.exports, require);
const P = mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }

ok(P.spGcd(96, 36) === 12, 'gcd(96,36)=12');
ok(P.spGcd(7, 13) === 1, 'coprime gcd=1');
ok(P.spPeriods(96, 36) === 3, 'periods = r/gcd = 3');
ok(P.spPeriods(100, 37) === 37, 'coprime-ish periods');
// curve closes: first and last points coincide
var c = P.spCurve('hypo', 96, 36, 60, 720);
var d0 = Math.hypot(c[0].x - c[c.length-1].x, c[0].y - c[c.length-1].y);
ok(d0 < 1e-6, 'hypotrochoid closes after full period');
var ce = P.spCurve('epi', 96, 36, 60, 720);
var d1 = Math.hypot(ce[0].x - ce[ce.length-1].x, ce[0].y - ce[ce.length-1].y);
ok(d1 < 1e-6, 'epitrochoid closes');
// d=0 degenerates to circle of radius R-r
var circ = P.spCurve('hypo', 96, 36, 0, 360);
var rads = circ.map(function(p){ return Math.hypot(p.x, p.y); });
ok(rads.every(function(rr){ return Math.abs(rr - 60) < 1e-6; }), 'd=0 gives circle radius R-r');
// bounds: hypotrochoid within |R-r|+d
var far = P.spCurve('hypo', 96, 36, 60, 1000);
ok(far.every(function(p){ return Math.hypot(p.x, p.y) <= 120 + 1e-6; }), 'points bounded by R-r+d');
// deterministic + svg structure
ok(JSON.stringify(P.spCurve('hypo', 90, 24, 40)) === JSON.stringify(P.spCurve('hypo', 90, 24, 40)), 'deterministic');
var svg = P.spSvg('hypo', 96, 36, 60, 480, '#22D3EE');
ok(svg.indexOf('<svg') === 0 && svg.includes('path d="M'), 'svg has path');
ok(svg.includes('#22D3EE'), 'svg uses given color');
console.log('PASS '+n+' assertions');
