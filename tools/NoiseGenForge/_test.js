
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('white length', A.white(100,1).length===100);
ok('white deterministic', JSON.stringify(A.white(20,7))===JSON.stringify(A.white(20,7)));
ok('white in range', A.white(500,3).every(function(x){return x>=-1&&x<=1;}));
ok('pink finite', A.pink(50,9).every(function(x){return isFinite(x);}));
ok('brown finite', A.brown(50,9).every(function(x){return isFinite(x);}));
ok('pink differs from white', JSON.stringify(A.pink(20,5))!==JSON.stringify(A.white(20,5)));
console.log('NoiseGenForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
