
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('triangular 10 =55', A.triangular(10)===55);
ok('square 7 =49', A.square(7)===49);
ok('pentagonal 4 =22', A.pentagonal(4)===22);
ok('isTriangular 55 true', A.isTriangular(55)===true);
ok('isTriangular 50 false', A.isTriangular(50)===false);
console.log('FigurateForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
