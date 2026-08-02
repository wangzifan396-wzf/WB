
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
ok('empty',C.score('').error!=null);
var r=C.score('The cat sat on the mat.');ok('words',r.value.words===6);ok('flesch high',r.value.flesch>90);
var r2=C.score('这是一个中文句子。');ok('cjk',r2.value.cjkChars>=7);ok('cjk words',r2.value.words>=7);
console.log((fail?'FAIL':'PASS')+' ReadabilityForge '+pass+'/'+fail);process.exit(fail?1:0);
