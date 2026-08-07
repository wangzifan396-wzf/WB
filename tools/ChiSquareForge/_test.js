
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r1=A.chiStat([[10,20],[20,10]]);
ok('chiStat 2x2 stat~6.6667', Math.abs(r1.stat-6.6667)<1e-3);
ok('chiStat 2x2 df=1', r1.df===1);
ok('chiStat 2x2 p in (0.005,0.02)', r1.p>0.005 && r1.p<0.02);
ok('chiP df1 x6.635 ~0.01', Math.abs(A.chiP(1,6.635)-0.01)<0.002);
var r2=A.chiStat([[5,5],[5,5]]);
ok('chiStat flat stat~0', r2.stat<1e-9);
ok('chiStat flat df=1', r2.df===1);
console.log('ChiSquareForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
