
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r=A.smithWaterman('GGTTGACTA','TGTTACGG',3,-3,-2);
ok('SW score 13', r.score===13);
ok('alignment length', r.a1.length===r.a2.length && r.a1.length>0);
console.log('SmithWatermanForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
