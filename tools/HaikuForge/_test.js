
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r=A.generate(42);
ok('3 lines', r.lines.length===3);
ok('5-7-5', r.syllables[0]===5 && r.syllables[1]===7 && r.syllables[2]===5);
var r2=A.generate(99);
ok('deterministic', JSON.stringify(r)===JSON.stringify(A.generate(42)));
console.log('HaikuForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
