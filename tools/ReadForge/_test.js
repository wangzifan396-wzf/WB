const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
function near(a,b,e){ return Math.abs(a-b)<=(e||0.15); }
ok('words 3', A.countWords('hello world foo')===3);
ok('sentences 3', A.countSentences('One. Two! Three?')===3);
ok('sentences none', A.countSentences('no terminal')===1);
ok('syll cat', A.countSyllables('cat')===1);
ok('syll hello', A.countSyllables('hello')===2);
ok('syll beautiful', A.countSyllables('beautiful')===3);
ok('syll the', A.countSyllables('the')===1);
var e1=A.fleschReadingEase('The cat sat.');
ok('ease score', near(e1.score,119.2,0.2));
var g1=A.fleschKincaidGrade('The cat sat.');
ok('grade simple', near(g1.grade,-2.6,0.2));
var easy=A.fleschReadingEase('The cat sat. We ran. He ate.');
var hard=A.fleschReadingEase('The establishment of sophisticated methodological frameworks necessitates comprehensive interdisciplinary implementation.');
ok('easy > hard', easy.score>hard.score);
ok('empty error', A.fleschReadingEase('').error!==undefined);
ok('grade words', A.fleschKincaidGrade('The cat sat.').words===3);
ok('ease syllables', e1.syllables===3);
console.log('ReadForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
