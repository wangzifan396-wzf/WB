
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
function near(a,b,t){return Math.abs(a-b)<=t;}
ok('lin uniq', A.solveLinear(2,4).type==='unique' && near(A.solveLinear(2,4).x,-2,1e-9));
ok('lin all', A.solveLinear(0,0).type==='all');
ok('lin none', A.solveLinear(0,5).type==='none');
ok('quad two', A.solveQuadratic(1,-3,2).type==='two' && near(A.solveQuadratic(1,-3,2).x1,2,1e-9) && near(A.solveQuadratic(1,-3,2).x2,1,1e-9));
ok('quad double', A.solveQuadratic(1,-2,1).type==='double' && near(A.solveQuadratic(1,-2,1).x,1,1e-9));
ok('quad complex', A.solveQuadratic(1,0,1).type==='complex' && near(A.solveQuadratic(1,0,1).re,0,1e-9) && near(A.solveQuadratic(1,0,1).im,1,1e-9));
ok('quad lin', A.solveQuadratic(0,2,4).linear===true && near(A.solveQuadratic(0,2,4).sol.x,-2,1e-9));
console.log('EqnForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
