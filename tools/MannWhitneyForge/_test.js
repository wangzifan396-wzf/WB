
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var m0=A.mannWhitney([1,2,3],[4,5,6]);
ok('strong sep U=0', m0.U===0);
ok('strong sep p<0.05', m0.p<0.05);
var m1=A.mannWhitney([1,2,3,4,5],[2,3,4,5,6]);
ok('overlap U range', m1.U>=0 && m1.U<=25);
ok('p in [0,1]', m1.p>=0 && m1.p<=1);
console.log('MannWhitneyForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
