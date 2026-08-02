const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
const J=JSON.stringify;
const def='draft,submit,review\nreview,approve,*approved\nreview,reject,draft\norphan,noop,orphan';
const fsm=A.fsmParse(def).value;
// parse
ok('parse ok', fsm!==null);
ok('initial draft', fsm.initial==='draft');
ok('states 4', fsm.states.length===4);
ok('finals approved', J(fsm.finals)===J(['approved']));
ok('parse empty error', A.fsmParse('').error!==null);
ok('parse bad line error', A.fsmParse('a,b').error!==null);
ok('parse nondeterministic error', A.fsmParse('a,x,b\na,x,c').error!==null);
ok('parse same target ok', A.fsmParse('a,x,b\na,x,b').error===null);
// reachability
const rc=A.fsmReachable(fsm).value;
ok('reachable 3', J(rc.reachable)===J(['approved','draft','review']));
ok('orphan unreachable', J(rc.unreachable)===J(['orphan']));
// dead states
const dead=A.fsmDeadStates(fsm).value;
ok('orphan dead', dead.indexOf('orphan')>=0);
ok('draft not dead', dead.indexOf('draft')<0);
ok('approved not dead', dead.indexOf('approved')<0);
// no-finals machine: everything dead
const nf=A.fsmParse('a,x,b\nb,y,a').value;
ok('no finals all dead', A.fsmDeadStates(nf).value.length===2);
// run
const r1=A.fsmRun(fsm,['submit','approve']);
ok('run accepted', r1.value.end==='approved' && r1.value.accepted===true);
ok('run path', J(r1.value.path)===J(['draft','submit'==='x'?'':'review','approved'].filter(Boolean)));
const r2=A.fsmRun(fsm,['submit','reject']);
ok('run back to draft', r2.value.end==='draft' && r2.value.accepted===false);
ok('run bad event error', A.fsmRun(fsm,['approve']).error!==null);
ok('run empty stays initial', A.fsmRun(fsm,[]).value.end==='draft');
ok('run error lists available', /submit/.test(A.fsmRun(fsm,['zzz']).error));
console.log('StateForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
