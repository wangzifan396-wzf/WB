const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
// factorial
ok('0! = 1', A.cbFact(0).value===1n);
ok('5! = 120', A.cbFact(5).value===120n);
ok('20! exact', A.cbFact(20).value===2432902008176640000n);
ok('100! digits 158', String(A.cbFact(100).value).length===158);
ok('fact negative error', A.cbFact(-1).error!==null);
ok('fact float error', A.cbFact(1.5).error!==null);
// nCr
ok('C(52,5) poker', A.cbNcr(52,5).value===2598960n);
ok('C(n,0)=1', A.cbNcr(10,0).value===1n);
ok('C(n,n)=1', A.cbNcr(10,10).value===1n);
ok('C symmetric', A.cbNcr(30,7).value===A.cbNcr(30,23).value);
ok('C(1000,500) big exact head', String(A.cbNcr(1000,500).value).slice(0,10)==='2702882409');
ok('C r>n error', A.cbNcr(3,5).error!==null);
// nPr
ok('P(5,2)=20', A.cbNpr(5,2).value===20n);
ok('P(10,10)=10!', A.cbNpr(10,10).value===A.cbFact(10).value);
ok('P(n,0)=1', A.cbNpr(7,0).value===1n);
// Catalan: 1,1,2,5,14,42,132...
ok('Cat(0)=1', A.cbCatalan(0).value===1n);
ok('Cat(5)=42', A.cbCatalan(5).value===42n);
ok('Cat(10)=16796', A.cbCatalan(10).value===16796n);
// Pascal
const p=A.cbPascal(5).value;
ok('pascal row4', p[4].join(',')==='1,4,6,4,1');
ok('pascal rowsum 2^n', p[4].reduce((a,b)=>a+b,0n)===16n);
ok('pascal bad rows', A.cbPascal(0).error!==null);
console.log('CombForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
