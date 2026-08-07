
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var norm=[0,1,-1,0.7,-0.7,0.4,-0.4,1.3,-1.3,0.2];
var unif=[0,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9];
var rn=A.jarqueBera(norm), ru=A.jarqueBera(unif);
ok('normal more normal (jb smaller)', rn.jb<ru.jb);
ok('p = exp(-jb/2)', Math.abs(rn.p-Math.exp(-rn.jb/2))<1e-12);
ok('p in (0,1]', rn.p>0 && rn.p<=1 && ru.p>0 && ru.p<=1);
console.log('JarqueBeraForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
