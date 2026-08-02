const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
var g={A:[['B',4],['C',2]], B:[['C',1]], C:[['D',3]], D:[]};
var r=A.dijkstra(g,'A');
ok('start dist 0', r.dist.A===0);
ok('dist C=2', r.dist.C===2);
ok('dist B=4', r.dist.B===4);
ok('dist D=5', r.dist.D===5);
ok('path to D', JSON.stringify(A.dijkstraPath(r,'A','D'))===JSON.stringify(['A','C','B','D']) || JSON.stringify(A.dijkstraPath(r,'A','D'))===JSON.stringify(['A','C','D']));
ok('unreachable Infinity', A.dijkstra({A:[], Z:[]},'A').dist.Z===Infinity);
ok('single node', A.dijkstra({A:[]},'A').dist.A===0);
ok('equal weights', (function(){ var g2={A:[['B',1],['C',1]]}; return A.dijkstra(g2,'A').dist.B===1 && A.dijkstra(g2,'A').dist.C===1; })());
ok('triangle shortcut', (function(){ var g3={A:[['B',1],['C',4]], B:[['C',2]]}; return A.dijkstra(g3,'A').dist.C===3; })());
ok('path triangle', JSON.stringify(A.dijkstraPath(A.dijkstra({A:[['B',1],['C',4]], B:[['C',2]]},'A'),'A','C'))===JSON.stringify(['A','B','C']));
ok('multiple edges min', (function(){ var g4={A:[['B',1],['B',5]]}; return A.dijkstra(g4,'A').dist.B===1; })());
ok('all keys present', Object.keys(r).length>0);
console.log('DijkstraForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
