
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r=A.generate(7);
ok('nonempty', typeof r==='string' && r.length>0);
ok('has suffix', /(乐团|乐队|组合|计划|俱乐部|实验)$/.test(r));
ok('deterministic', r===A.generate(7));
console.log('BandNameForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
