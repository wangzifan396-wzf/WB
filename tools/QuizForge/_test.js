
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var q=A.parseQuiz('q1 | a | b | c | 1\nq2 | x | y | 2\n# comment');
ok('count', q.length===2);
ok('opt', q[0].options.length===3 && q[0].answer===1);
var g=A.grade(q,[1,2]); ok('grade', g.correct===2 && g.total===2);
var sh=A.shuffle([1,2,3], rngFactory(7)); ok('shuffle', sh.length===3 && sh.slice().sort().join(',')==='1,2,3');
var sh2=A.shuffle([1,2,3], rngFactory(7)); ok('deterministic', sh.join(',')===sh2.join(','));
console.log('QuizForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
