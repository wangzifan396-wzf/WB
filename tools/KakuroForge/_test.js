
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var puz=A.kkGen(7); ok('gen not null', !!puz);
if(puz){ var seen=true; puz.runs.forEach(function(r,idx){ var sum=0, set={}; r.cells.forEach(function(c){ var v=puz.solution[c[0]+','+c[1]]; if(v<1||v>9||set[v]) seen=false; set[v]=1; sum+=v; }); if(sum!==puz.clues[idx]) seen=false; }); ok('runs valid', seen); }
console.log('KakuroForge _test: '+pass+' passed, '+fail+' failed'); process.exit(fail?1:0);
