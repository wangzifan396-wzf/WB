
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var cnt=A.count('ATAT',2);
ok('AT count', cnt.AT===2);
ok('TA count', cnt.TA===1);
ok('uppercase + strip', A.count('atx',2).AT===1);
var t=A.topK('ATATCG',2,1);
ok('top first', t.length===1 && t[0][0]==='AT' && t[0][1]===2);
console.log('KmerForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
