const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
function near(a,b,e){ return Math.abs(a-b)<=(e||1e-9); }
var e=A.bloomCreate(100,4,12345);
ok('empty has false', A.bloomHas(e,'alice')===false);
var bf=A.bloomCreate(100,4,12345);
A.bloomAdd(bf,'alice'); A.bloomAdd(bf,'bob'); A.bloomAdd(bf,'carol');
ok('has alice', A.bloomHas(bf,'alice')===true);
ok('has bob', A.bloomHas(bf,'bob')===true);
ok('has carol', A.bloomHas(bf,'carol')===true);
var one=A.bloomCreate(1000,4,1); A.bloomAdd(one,'x');
var cnt=one.bits.reduce(function(a,b){return a+b;},0);
ok('k bits set for single', cnt===4);
ok('add returns bf', typeof A.bloomAdd(A.bloomCreate(50,3,7),'y')==='object');
ok('deterministic', A.bloomHas(bf,'alice')===A.bloomHas(bf,'alice'));
ok('fp 4,100,2', near(A.bloomFalsePositiveRate(4,100,2), Math.pow(1-Math.exp(-4*2/100),4), 1e-12));
ok('fp 3,1000,100', near(A.bloomFalsePositiveRate(3,1000,100), Math.pow(1-Math.exp(-3*100/1000),3), 1e-12));
ok('fp decreases with m', A.bloomFalsePositiveRate(4,100,10) > A.bloomFalsePositiveRate(4,1000,10));
ok('fp increases with n', A.bloomFalsePositiveRate(4,1000,10) < A.bloomFalsePositiveRate(4,1000,100));
var big=A.bloomCreate(5000,7,99); var allpresent=true;
for(var i=0;i<200;i++){ var s='item'+i; A.bloomAdd(big,s); if(!A.bloomHas(big,s)) allpresent=false; }
ok('200 items all present', allpresent);
console.log('BloomForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
