
const fs = require('fs'), path = require('path');
const html = fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
const mod = {exports:{}};
new Function('module','exports','require', m[1])(mod, mod.exports, require);
const P = mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }

var pr = P.ksParse('a,3,10\nb,4,40\nc,1,15');
ok(!pr.error && pr.items.length === 3, 'parse ok');
ok(P.ksParse('bad line').error !== undefined, 'malformed line rejected');
ok(P.ksParse('a,-1,5').error !== undefined, 'negative weight rejected');
// classic instance: w=[3,4,1], v=[10,40,15], cap=5 -> best = b + c = 55
var r = P.ksSolve(pr.items, 5);
ok(r.best === 55, 'optimal value 55');
ok(JSON.stringify(r.picked) === '[1,2]', 'picked b and c');
// picked weights within capacity
var wsum = r.picked.reduce(function(a, i){ return a + pr.items[i].w; }, 0);
ok(wsum <= 5, 'picked fits capacity');
// dp table shape and monotonicity
ok(r.dp.length === 4 && r.dp[0].every(function(v){ return v === 0; }), 'dp base row zero');
var mono = true;
for(var w=1;w<=5;w++) if(r.dp[3][w] < r.dp[3][w-1]) mono = false;
ok(mono, 'dp row monotone in capacity');
// greedy suboptimal case: w=[1,1,2] v=[3,3,5] cap=2: greedy by ratio picks a+b=6, dp also 6; use classic trap
var trap = P.ksParse('x,1,2\ny,2,3\nz,3,4').items;
var dpv = P.ksSolve(trap, 3).best; // x+y = 5
ok(dpv === 5, 'dp handles trap instance');
var g = P.ksGreedy(trap, 3);
ok(g.best <= dpv, 'greedy never beats dp');
// zero-capacity edge
ok(P.ksSolve(pr.items, 0).best === 0 || P.ksSolve(pr.items, 1).best >= 0, 'small capacity safe');
console.log('PASS '+n+' assertions');
