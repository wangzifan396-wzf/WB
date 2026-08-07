
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var s=A.sampleN(0,1,100000,7); var mean=s.reduce(function(a,b){return a+b;},0)/s.length; var v=s.reduce(function(a,b){return a+(b-mean)*(b-mean);},0)/s.length;
ok('mean ~0', Math.abs(mean)<0.05);
ok('var ~1', Math.abs(v-1)<0.05);
ok('deterministic len', A.sampleN(0,1,100,5).length===100 && A.sampleN(0,1,100,5)[0]===A.sampleN(0,1,100,5)[0]);
console.log('NormalSamplingForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
