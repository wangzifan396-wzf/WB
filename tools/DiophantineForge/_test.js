
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var e=A.egcd(30,20);
ok('egcd g=10', e.g===10);
ok('30x+20y=10', 30*e.x+20*e.y===10);
var s=A.solveLinear(30,20,10); ok('solve 30x+20y=10', s && 30*s.x+20*s.y===10);
var n=A.solveLinear(2,4,5); ok('no solution', n===null);
console.log('DiophantineForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
