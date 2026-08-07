
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var P=[[0.9,0.1],[0.5,0.5]]; var s=A.steadyState(P);
ok('steady sums 1', Math.abs(s[0]+s[1]-1)<1e-6);
ok('steady [5/6,1/6]', Math.abs(s[0]-5/6)<1e-3 && Math.abs(s[1]-1/6)<1e-3);
var P2=[[0.7,0.3],[0.2,0.8]]; var s2=A.steadyState(P2);
ok('steady2 sums 1', Math.abs(s2[0]+s2[1]-1)<1e-6);
ok('steady2 [0.4,0.6]', Math.abs(s2[0]-0.4)<1e-4 && Math.abs(s2[1]-0.6)<1e-4);
console.log('MarkovChainForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
