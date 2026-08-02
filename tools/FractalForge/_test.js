const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
// mandelbrot membership
ok('origin in set', A.frMandelPoint(0,0,50)===50);
ok('c=-1 in set', A.frMandelPoint(-1,0,50)===50);
ok('c=2 escapes fast', A.frMandelPoint(2,0,50)<3);
ok('c=0.3+0.6i escapes', A.frMandelPoint(0.3,0.6,100)<100);
ok('escape count monotonic-ish', A.frMandelPoint(0.5,0.5,50)<=A.frMandelPoint(0.25,0.25,50));
const g=A.frMandelGrid(16,12,30);
ok('grid dims', g.value.length===12 && g.value[0].length===16);
ok('grid bad size error', A.frMandelGrid(4,4).error!==null && A.frMandelGrid(500,10).error!==null);
ok('grid contains set pixels', g.value.some(r=>r.some(v=>v===30)));
// koch: segments = 3 * 4^order
ok('koch order0 3 segs', A.frKoch(0).value.length===3);
ok('koch order1 12 segs', A.frKoch(1).value.length===12);
ok('koch order3 192 segs', A.frKoch(3).value.length===192);
ok('koch bad order', A.frKoch(-1).error!==null && A.frKoch(2.5).error!==null);
// koch perimeter grows by 4/3 each order
function klen(segs){ return segs.reduce((s,g2)=>s+Math.hypot(g2[1][0]-g2[0][0],g2[1][1]-g2[0][1]),0); }
ok('koch length ratio 4/3', Math.abs(klen(A.frKoch(1).value)/klen(A.frKoch(0).value)-4/3)<1e-9);
// koch continuity: each segment starts where previous ends (within a side chain)
const k1=A.frKoch(1).value;
ok('koch chained', Math.hypot(k1[0][1][0]-k1[1][0][0], k1[0][1][1]-k1[1][0][1])<1e-9);
// sierpinski: triangles = 3^order
ok('sierpinski order0 1 tri', A.frSierpinski(0).value.length===1);
ok('sierpinski order2 9 tris', A.frSierpinski(2).value.length===9);
ok('sierpinski order4 81 tris', A.frSierpinski(4).value.length===81);
ok('sierpinski bad order', A.frSierpinski(8).error!==null);
// area halves-ish: each sub triangle side = 1/2, total area = 3/4 of previous
function area(t){ return Math.abs((t[1][0]-t[0][0])*(t[2][1]-t[0][1])-(t[2][0]-t[0][0])*(t[1][1]-t[0][1]))/2; }
const s0=area(A.frSierpinski(0).value[0]);
const s1=A.frSierpinski(1).value.reduce((s,t)=>s+area(t),0);
ok('sierpinski area 3/4', Math.abs(s1/s0-0.75)<1e-9);
// svg
ok('svg mandelbrot', A.frSvg('mandelbrot',0).value.indexOf('<svg')===0);
ok('svg koch has path', A.frSvg('koch',2).value.indexOf('<path')>-1);
ok('svg sierpinski polygons', A.frSvg('sierpinski',1).value.split('<polygon').length-1===3);
ok('svg unknown error', A.frSvg('nope',1).error!==null);
console.log('FractalForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
