
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
function near(a,b,t){return Math.abs(a-b)<=(t||1e-9);}
ok('5020', near(A.alloc(10000,[0.5,0.3,0.2])[0],5000));
ok('5020 wants', near(A.alloc(10000,[0.5,0.3,0.2])[1],3000));
ok('5020 save', near(A.alloc(10000,[0.5,0.3,0.2])[2],2000));
var r=A.alloc502010(10000);
ok('needs', near(r.needs,5000)); ok('savings', near(r.savings,2000));
console.log('BudgetForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
