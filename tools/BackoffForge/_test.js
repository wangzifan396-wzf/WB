const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
ok('expDelay 0', A.expDelay(0)===1000);
ok('expDelay 1', A.expDelay(1)===2000);
ok('expDelay 2', A.expDelay(2)===4000);
ok('expDelay cap', A.expDelay(5)===30000);
ok('expDelay custom', A.expDelay(1,{base:500,cap:100000,factor:3})===1500);
ok('none = expDelay', A.backoff(2,{strategy:'none'}).value===4000);
ok('full rng0', A.backoff(2,{strategy:'full'},function(){return 0;}).value===0);
ok('full rng1 = d', A.backoff(2,{strategy:'full'},function(){return 1;}).value===4000);
ok('equal rng0 = half', A.backoff(2,{strategy:'equal'},function(){return 0;}).value===2000);
ok('equal rng1 = d', A.backoff(2,{strategy:'equal'},function(){return 1;}).value===4000);
ok('decorrelated rng0', A.backoff(2,{strategy:'decorrelated'},function(){return 0;}).value===3000);
ok('decorrelated rng1', A.backoff(2,{strategy:'decorrelated'},function(){return 1;}).value===4000);
ok('backoff unknown', A.backoff(1,{strategy:'xx'}).error!==undefined && A.backoff(1,{strategy:'xx'}).value===undefined);
ok('full range', A.backoff(3,{strategy:'full'},function(){return 0;}).max===A.expDelay(3));
console.log('BackoffForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
