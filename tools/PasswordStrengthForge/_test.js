
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var e=A.score(''); ok('empty score 0', e.score===0);
var a=A.score('abcdef'); ok('lower6 score>=2', a.score>=2);
var b=A.score('Ab1!xq9'); ok('mixed8 score>=3', b.score>=3);
var weak=A.score('aaaaaa'); var strong=A.score('aB3$kK9m'); ok('mixed > repeated bits', strong.bits>weak.bits);
ok('bits nonneg', a.bits>=0 && b.bits>=0);
console.log('PasswordStrengthForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
