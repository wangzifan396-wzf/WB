
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var g=A.fuGen(5, 3); var sol=A.fuSolve(g.puzzle, g.cons);
ok('solve exists', !!sol);
function valid(g,cons){ if(!g) return false; for(var r=0;r<5;r++){ var rs={},cs={}; for(var c=0;c<5;c++){ if(g[r][c]<1||g[r][c]>5) return false; rs[g[r][c]]=1; cs[g[c][r]]=1; } if(Object.keys(rs).length!==5) return false; if(Object.keys(cs).length!==5) return false; } for(var k=0;k<cons.length;k++){ var a=cons[k].a,b=cons[k].b; if(cons[k].op==='<'&&!(g[a[0]][a[1]]<g[b[0]][b[1]])) return false; if(cons[k].op==='>'&&!(g[a[0]][a[1]]>g[b[0]][b[1]])) return false; } return true; }
ok('valid solution', valid(sol, g.cons));
console.log('FutoshikiForge _test: '+pass+' passed, '+fail+' failed'); process.exit(fail?1:0);
