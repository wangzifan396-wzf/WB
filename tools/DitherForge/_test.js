
const fs = require('fs'), path = require('path');
const html = fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
const mod = {exports:{}};
new Function('module','exports','require', m[1])(mod, mod.exports, require);
const P = mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }

ok(Math.abs(P.dtGray(255,255,255) - 255) < 0.01, 'white gray = 255');
ok(P.dtGray(0,0,0) === 0, 'black gray = 0');
// binary output invariant across all algorithms
var g = P.dtDemo(32);
ok(g.length === 1024, 'demo size');
['dtThreshold','dtBayer','dtFloyd'].forEach(function(fn){
  var out = P[fn](g, 32, 32);
  ok(out.length === 1024 && out.every(function(v){ return v === 0 || v === 255; }), fn + ' output is 1-bit');
});
// Floyd-Steinberg preserves average luminance better than threshold on mid-gray field
var mid = new Array(64*64).fill(100);
function avg(a){ return a.reduce(function(s,v){ return s+v; }, 0) / a.length; }
var fsAvg = avg(P.dtFloyd(mid, 64, 64));
var thAvg = avg(P.dtThreshold(mid, 64, 64));
ok(Math.abs(fsAvg - 100) < 10, 'FS preserves mean luminance (~100)');
ok(Math.abs(thAvg - 100) > 90, 'plain threshold destroys mean (all black)');
// Bayer on mid-gray produces mixed pattern
var by = P.dtBayer(mid, 8, 8);
ok(by.indexOf(0) >= 0 && by.indexOf(255) >= 0, 'Bayer mixes black and white on mid-gray');
// deterministic
ok(JSON.stringify(P.dtFloyd(g, 32, 32)) === JSON.stringify(P.dtFloyd(g, 32, 32)), 'FS deterministic');
// Bayer matrix is a permutation of 0..15
var flat = [].concat.apply([], P.DT_BAYER4).slice().sort(function(a,b){ return a-b; });
ok(flat.join(',') === Array.from({length:16}, function(_,i){ return i; }).join(','), 'Bayer4 matrix valid');
console.log('PASS '+n+' assertions');
