
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var Q=A.qInit(4,4);
ok('q terminal update', Math.abs(A.qStep(Q,4,4,0,0,10,0,true,1,0.9)-10)<1e-9);
var Q2=A.qInit(4,4); Q2[1][0]=5; ok('q next-max update', Math.abs(A.qStep(Q2,4,4,0,0,-1,1,false,1,0.9)-3.5)<1e-9);
ok('gw step right', A.gwStep(4,4,5,3)===6);
ok('gw step up', A.gwStep(4,4,5,0)===1);
// convergence on 4x4 gridworld (goal=15)
var rows=4,cols=4,goal=15,Q3=A.qInit(rows,cols), rnd=A._rng(7), alpha=0.2, gamma=0.95;
for(var e=0;e<900;e++){ var s=0; var eps=Math.max(0.05,0.5*(1-e/900));
  while(true){ var a; if(rnd()<eps) a=Math.floor(rnd()*4); else a=A.qBest(Q3,s);
    var ns=A.gwStep(rows,cols,s,a); var r=A.gwReward(ns,goal); var term=A.gwTerminal(ns,goal);
    A.qStep(Q3,rows,cols,s,a,r,ns,term,alpha,gamma); s=ns; if(term) break; } }
var s=0,st=0; while(!A.gwTerminal(s,goal) && st<50){ s=A.gwStep(rows,cols,s,A.qBest(Q3,s)); st++; }
ok('ql reaches goal', A.gwTerminal(s,goal));
console.log('QLearningForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
