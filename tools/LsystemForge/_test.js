
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
const mod = {exports:{}};
new Function('module','exports','require', m[1])(mod, mod.exports, require);
const P = mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }

ok(P.lsParse('F',{F:'FF'},3)==='FFFFFFFF', 'lsParse repeat');
var segs=P.lsTurtle('F+F-F', 90);
ok(segs.length===3, 'turtle 3 segments, got '+segs.length);
var b=P.lsBounds(segs);
ok(isFinite(b.minX)&&isFinite(b.maxX)&&b.maxX>=b.minX, 'bounds finite');
var svg=P.lsSvg(segs, 100, 100);
ok(/<svg/.test(svg)&&/<path/.test(svg), 'svg has path');
ok(P.lsSvg([],100,100).indexOf('<svg')===0, 'empty segs -> bare svg');
// koch determinism
ok(P.lsParse('F',{F:'F+F-F-F+F'},2)===P.lsParse('F',{F:'F+F-F-F+F'},2), 'deterministic');

console.log('PASS '+n+' assertions');
