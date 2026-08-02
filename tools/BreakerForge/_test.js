const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
var cb=A.cbCreate({failureThreshold:3, successThreshold:2, timeoutMs:1000});
ok('init closed', cb.state==='CLOSED');
A.cbFailure(cb,0); A.cbFailure(cb,0);
ok('still closed at 2', cb.state==='CLOSED');
A.cbFailure(cb,0);
ok('open at threshold', cb.state==='OPEN');
ok('allow false when open (t=0)', A.cbAllow(cb,0).allow===false);
ok('allow false state open', A.cbAllow(cb,0).state==='OPEN');
var r=A.cbAllow(cb,1500);
ok('half-open after timeout', r.state==='HALF_OPEN' && r.allow===true);
A.cbSuccess(cb,1500);
ok('half-open still', cb.state==='HALF_OPEN');
A.cbSuccess(cb,1500);
ok('closed after success threshold', cb.state==='CLOSED');
// half-open -> reopen on failure
var cb2=A.cbCreate({failureThreshold:1, successThreshold:2, timeoutMs:100});
A.cbFailure(cb2,0); A.cbAllow(cb2,200); A.cbFailure(cb2,200);
ok('reopen on half-open failure', cb2.state==='OPEN');
// closed resets failures on success
var cb3=A.cbCreate({failureThreshold:3, successThreshold:2, timeoutMs:100});
A.cbFailure(cb3,0); A.cbSuccess(cb3,0);
ok('success resets failures in closed', cb3.failures===0 && cb3.state==='CLOSED');
ok('allow closed true', A.cbAllow(A.cbCreate({}),500).allow===true);
ok('failure returns obj', typeof A.cbFailure(A.cbCreate({}),0).state==='string');
console.log('BreakerForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
