
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('syllables cat=1', A.countSyllables('cat')===1);
ok('syllables hello=2', A.countSyllables('hello')===2);
ok('syllables beautiful=3', A.countSyllables('beautiful')===3);
ok('syllables make=1', A.countSyllables('make')===1);
var s=A.stats('The cat sat.'); ok('stats 3 words 1 sentence 3 syll', s.words===3 && s.sentences===1 && s.syllables===3);
ok('flesch 119.2', Math.abs(A.flesch('The cat sat.')-119.19)<1e-1);
ok('kincaid small', A.kincaid('The cat sat.')<0);
console.log('ReadingLevelForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
