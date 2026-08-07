
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r=A.needleman('GATTACA','GCATGCU',1,-1,-1);
ok('NW score 0', r.score===0);
ok('alignment length', r.a1.length===r.a2.length);
console.log('NeedlemanForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
