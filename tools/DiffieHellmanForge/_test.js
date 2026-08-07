
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r=A.dh(23n,5n,6n,15n);
ok('shared 2', r.shared===2n);
ok('match', r.match===true);
ok('A=8', r.A===8n);
ok('B=19', r.B===19n);
console.log('DiffieHellmanForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
