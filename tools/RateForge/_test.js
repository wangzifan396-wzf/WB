const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('tb init tokens', A.TokenBucket(5,1).tokens===5);
var b=A.TokenBucket(5,1);
var r1=A.tbConsume(b,5,0); ok('tb consume all allowed', r1.allowed && r1.tokensLeft===0);
var b1=r1.state;
var r2=A.tbConsume(b1,1,0); ok('tb deny after empty', !r2.allowed && r2.retryAfterMs===1000);
ok('tb state unchanged on deny', r2.state===b1 && r2.state.last===0);
var r3=A.tbConsume(b1,1,500); ok('tb after 500ms refill .5', !r3.allowed && r3.retryAfterMs===500);
var r4=A.tbConsume(b1,1,1000); ok('tb after 1000ms allowed', r4.allowed && Math.abs(r4.tokensLeft)<1e-6);
var b4=r4.state;
var r5=A.tbConsume(b4,1,1000); ok('tb deny again at 1000', !r5.allowed);
ok('tb cap bound', A.tbConsume(A.TokenBucket(5,1),6,0).allowed===false);
ok('refill cap', A.tbRefill(A.TokenBucket(5,1),100000).tokens===5);
var lb=A.LeakyBucket(10,2);
var l1=A.lbConsume(lb,10,0); ok('lb fill allowed', l1.allowed && l1.waterLeft===10);
var lb1=l1.state;
var l2=A.lbConsume(lb1,1,0); ok('lb deny full', !l2.allowed && l2.retryAfterMs===500);
var l3=A.lbConsume(lb1,1,500); ok('lb leak 1 at 500', l3.allowed && l3.waterLeft===10);
var lb3=l3.state;
var l4=A.lbConsume(lb3,1,600); ok('lb deny at 600', !l4.allowed);
ok('lb capacity bound', A.lbConsume(A.LeakyBucket(10,2),11,0).allowed===false);
console.log('RateForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
