
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var puz=null; for(var s=1;s<=20 && !puz; s++){ puz=A.brGen(8,6,6,s); }
ok('gen not null', !!puz);
if(puz){ var deg=[]; for(var i=0;i<puz.islands.length;i++) deg.push(0); puz.edges.forEach(function(e){ deg[e[0]]++; deg[e[1]]++; });
  var okd=true; for(var i=0;i<puz.clues.length;i++) if(puz.clues[i]!==deg[i]) okd=false;
  ok('clue=degree', okd);
  // connectivity via BFS
  var seen={}, q=[0]; seen[0]=1; while(q.length){ var u=q.shift(); puz.edges.forEach(function(e){ var v=(e[0]===u)?e[1]:(e[1]===u?e[0]:-1); if(v>=0&&!seen[v]){ seen[v]=1; q.push(v); } }); }
  ok('connected', Object.keys(seen).length===puz.islands.length);
}
console.log('BridgesForge _test: '+pass+' passed, '+fail+' failed'); process.exit(fail?1:0);
