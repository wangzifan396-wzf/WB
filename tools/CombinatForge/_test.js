
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('nCr', A.nCr(10,3)===120n);
ok('nPr', A.nPr(10,3)===720n);
ok('nCrR', A.nCrR(5,2)===15n);
ok('nPrR', A.nPrR(3,2)===9n);
ok('fact', A.fact(5)===120n);
ok('nCr edge', A.nCr(5,6)===0n && A.nCr(5,0)===1n);
console.log('CombinatForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
