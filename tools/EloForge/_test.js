const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
// expectation
ok('equal ratings 50%', A.eloExpect(1500,1500).value===0.5);
ok('+400 favors ~90.9%', Math.abs(A.eloExpect(1900,1500).value-10/11)<1e-9);
ok('-400 underdog ~9.1%', Math.abs(A.eloExpect(1500,1900).value-1/11)<1e-9);
ok('symmetry sums to 1', Math.abs(A.eloExpect(1600,1400).value+A.eloExpect(1400,1600).value-1)<1e-12);
ok('expect NaN error', A.eloExpect(NaN,1500).error!==null);
// update
const u=A.eloUpdate(1500,1500,1,32);
ok('win equal +16', u.value.ra===1516 && u.value.rb===1484);
ok('zero-sum', Math.abs((u.value.ra-1500)+(u.value.rb-1500))<1e-9);
const d=A.eloUpdate(1500,1500,0.5,32);
ok('draw equal no change', d.value.ra===1500 && d.value.rb===1500);
const up=A.eloUpdate(1400,1800,1,32); // upset win
ok('upset gains more', up.value.deltaA>28);
const fav=A.eloUpdate(1800,1400,1,32); // expected win
ok('favorite gains little', fav.value.ra-1800<4);
ok('bad score error', A.eloUpdate(1500,1500,0.7,32).error!==null);
ok('default k', A.eloUpdate(1500,1500,1).value.ra===1516);
// K factor scaling
ok('k16 half of k32', (A.eloUpdate(1500,1500,1,16).value.ra-1500)*2===(A.eloUpdate(1500,1500,1,32).value.ra-1500));
// series
const s=A.eloSeries(1500,1650,[1,0.5,0],32);
ok('series 3 games', s.value.history.length===3);
ok('series chained', s.value.history[1].ra!==s.value.history[0].ra);
ok('series final matches last', s.value.finalA===s.value.history[2].ra);
ok('series empty error', A.eloSeries(1500,1500,[],32).error!==null);
ok('series bad score error', A.eloSeries(1500,1500,[2],32).error!==null);
console.log('EloForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
