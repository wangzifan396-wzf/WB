const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
// rng deterministic
const r1=A.mzRng(42), r2=A.mzRng(42), r3=A.mzRng(43);
ok('rng deterministic', r1()===r2());
ok('rng seed differs', A.mzRng(42)()!==r3());
ok('rng in [0,1)', (()=>{ const f=A.mzRng(7); for(let i=0;i<100;i++){ const v=f(); if(v<0||v>=1) return false; } return true; })());
// gen
const g=A.mzGen(10, 8, 42);
ok('gen ok', g.error===null);
ok('all cells visited', g.value.visited===80);
ok('same seed same maze', JSON.stringify(A.mzGen(10,8,42).value)===JSON.stringify(g.value));
ok('diff seed diff maze', JSON.stringify(A.mzGen(10,8,43).value)!==JSON.stringify(g.value));
ok('gen bad size error', A.mzGen(2,5).error!==null && A.mzGen(10.5,8).error!==null);
// wall symmetry: cell(e)=neighbor(w)
let sym=true;
for(let y=0;y<8;y++) for(let x=0;x<9;x++) if(g.value.cells[y][x].e!==g.value.cells[y][x+1].w) sym=false;
ok('wall symmetry e/w', sym);
let sym2=true;
for(let y=0;y<7;y++) for(let x=0;x<10;x++) if(g.value.cells[y][x].s!==g.value.cells[y+1][x].n) sym2=false;
ok('wall symmetry n/s', sym2);
// perfect maze: passages = cells-1 (spanning tree)
let passages=0;
for(let y=0;y<8;y++) for(let x=0;x<10;x++){ if(!g.value.cells[y][x].e && x<9) passages++; if(!g.value.cells[y][x].s && y<7) passages++; }
ok('spanning tree edges', passages===79);
// solve
const s=A.mzSolve(g.value);
ok('solve ok', s.error===null);
ok('path starts 0,0', s.value.path[0].join(',')==='0,0');
ok('path ends 9,7', s.value.path[s.value.path.length-1].join(',')==='9,7');
ok('path steps adjacent', s.value.path.every((p,i)=>i===0 || Math.abs(p[0]-s.value.path[i-1][0])+Math.abs(p[1]-s.value.path[i-1][1])===1));
ok('expanded >= path', s.value.expanded>=s.value.length);
ok('solve custom endpoints', A.mzSolve(g.value, 0, 0, 0, 0).value.length===1);
ok('solve oob error', A.mzSolve(g.value, -1, 0).error!==null);
// svg
ok('svg renders', A.mzSvg(g.value).indexOf('<svg')===0);
ok('svg with path polyline', A.mzSvg(g.value, s.value.path).indexOf('<polyline')>-1);
console.log('MazeForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
