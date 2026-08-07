
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var p=A.pick(5);
ok('pair length 2', p.length===2);
ok('deterministic', JSON.stringify(A.pick(9))===JSON.stringify(A.pick(9)));
ok('from list', A.PAIRS.indexOf(p)>=0);
ok('valid count', A.PAIRS.length>=8);
console.log('FontPairingForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
