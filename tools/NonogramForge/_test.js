
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('row clues', JSON.stringify(A.nonoRowClues([1,1,0,1,1,1]))===JSON.stringify([2,3]));
var g=A.nonoRand(5,5,9); var cl=A.nonoClues(g); ok('clues rows', cl.rows.length===5 && cl.cols.length===5);
ok('check true', A.nonoCheck(g,g)===true);
ok('check false', A.nonoCheck([[0,0],[0,0]],[[1,0],[0,0]])===false);
console.log('NonogramForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
