
const fs = require('fs'), path = require('path');
const html = fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
const mod = {exports:{}};
new Function('module','exports','require', m[1])(mod, mod.exports, require);
const P = mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }

// uniform field -> single leaf
var flat = [];
for(var y=0;y<16;y++){ var r=[]; for(var x=0;x<16;x++) r.push(128); flat.push(r); }
var t1 = P.qtBuild(flat, 0, 0, 16, 5, 2);
ok(t1.leaf === true && Math.abs(t1.v - 128) < 1e-9, 'uniform field collapses to one leaf');
// half black / half white splits
var half = [];
for(var y=0;y<16;y++){ var r2=[]; for(var x=0;x<16;x++) r2.push(x < 8 ? 0 : 255); half.push(r2); }
var t2 = P.qtBuild(half, 0, 0, 16, 5, 2);
ok(t2.leaf === false, 'contrast forces split');
var c2 = P.qtCount(t2);
ok(c2.leaves >= 2, 'multiple leaves after split');
// leaves tile the area exactly
var area = P.qtLeaves(t2).reduce(function(a, L){ return a + L.s*L.s; }, 0);
ok(area === 256, 'leaves tile full area');
// zero threshold on checker -> more leaves than high threshold
var g = P.qtPattern('checker', 32);
var lo = P.qtCount(P.qtBuild(g, 0, 0, 32, 1, 2)).leaves;
var hi = P.qtCount(P.qtBuild(g, 0, 0, 32, 200, 2)).leaves;
ok(lo > hi, 'lower threshold -> more leaves');
ok(hi === 1, 'huge threshold -> single leaf');
// stats correctness
var st = P.qtStats([[0,0],[10,10]], 0, 0, 2);
ok(Math.abs(st.mean - 5) < 1e-9 && Math.abs(st.std - 5) < 1e-9, 'mean/std computed correctly');
// deterministic
ok(JSON.stringify(P.qtBuild(g,0,0,32,10,2)) === JSON.stringify(P.qtBuild(g,0,0,32,10,2)), 'build deterministic');
// pattern generators
ok(P.qtPattern('gradient', 8)[0][0] === 0, 'gradient starts at 0');
ok(P.qtPattern('circles', 8).length === 8, 'pattern size respected');
console.log('PASS '+n+' assertions');
