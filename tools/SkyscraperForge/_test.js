
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var g=A.skyGen(4, 11); var sol=A.skySolve(g.clues);
ok('solve exists', !!sol);
function eq(a,b){ return JSON.stringify(a)===JSON.stringify(b); }
ok('valid', sol && A.skyVis(sol[0])===g.clues.top[0] && A.skyVis(sol[0].slice().reverse())===g.clues.bottom[0]);
ok('unique-ish', eq(A.skySolve(g.clues), sol));
console.log('SkyscraperForge _test: '+pass+' passed, '+fail+' failed'); process.exit(fail?1:0);
