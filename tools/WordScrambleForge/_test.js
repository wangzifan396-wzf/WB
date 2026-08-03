
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('len', A.scramble('abc').length===3);
ok('check', A.check('cat','CAT')===true);
ok('check no', A.check('cat','dog')===false);
ok('shuffle', A.shuffleArr([1,2,3]).length===3);
console.log('WordScrambleForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
