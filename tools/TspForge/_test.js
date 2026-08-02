
const fs = require('fs'), path = require('path');
const html = fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
const mod = {exports:{}};
new Function('module','exports','require', m[1])(mod, mod.exports, require);
const P = mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }

var cs = P.tspCities(30, 600, 400, 42);
ok(cs.length === 30, 'city count');
ok(JSON.stringify(P.tspCities(30, 600, 400, 42)) === JSON.stringify(cs), 'deterministic cities');
ok(cs.every(function(c){ return c.x >= 20 && c.x <= 580 && c.y >= 20 && c.y <= 380; }), 'cities in margin bounds');
var nn = P.tspNearest(cs);
ok(nn.length === 30, 'tour visits all');
ok(new Set(nn).size === 30, 'tour is a permutation');
var lnn = P.tspLength(cs, nn);
var opt = P.tspTwoOpt(cs, nn, 60);
ok(new Set(opt).size === 30, '2-opt keeps permutation');
var lopt = P.tspLength(cs, opt);
ok(lopt <= lnn + 1e-9, '2-opt never worse');
// random tour should be worse than NN in general (seeded shuffle)
var rnd = P.tspRng(7), randTour = nn.slice();
for(var i=randTour.length-1;i>0;i--){ var j = Math.floor(rnd()*(i+1)); var t=randTour[i]; randTour[i]=randTour[j]; randTour[j]=t; }
ok(P.tspLength(cs, randTour) > lopt, 'optimized beats random shuffle');
// square: 2-opt should find the optimal 4-cycle (perimeter 40)
var sq = [{x:0,y:0},{x:10,y:0},{x:0,y:10},{x:10,y:10}];
var sqOpt = P.tspTwoOpt(sq, [0,1,2,3], 20);
ok(Math.abs(P.tspLength(sq, sqOpt) - 40) < 1e-9, '2-opt solves square optimally');
ok(Math.abs(P.tspDist({x:0,y:0},{x:3,y:4}) - 5) < 1e-12, 'euclidean distance');
console.log('PASS '+n+' assertions');
