
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var d=A.detectIQR([1,2,3,4,5,6,7,8,9,100],1.5);
ok('IQR flags 100', d.length===1 && d[0]===100);
ok('IQR none for tight', A.detectIQR([1,2,3,4,5],1.5).length===0);
var z=A.detectZ([1,2,3,4,5,6,7,8,9,100],2.5);
ok('z flags 100', z.indexOf(100)>=0);
ok('mean/stdev basic', Math.abs(A.mean([1,2,3])-2)<1e-9 && Math.abs(A.stdev([2,4,6])-2)<1e-9);
console.log('OutlierForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
