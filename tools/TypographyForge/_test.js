
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var s=A.modularScale(16,1.25,3);
ok('scale length 4', s.length===4);
ok('scale base', s[0]===16);
ok('scale step2', Math.abs(s[2]-25)<1e-6);
ok('golden preset', Math.abs(A.PRESETS.golden-1.618)<1e-9);
ok('monotonic', s[0]<s[1]&&s[1]<s[2]&&s[2]<s[3]);
console.log('TypographyForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
