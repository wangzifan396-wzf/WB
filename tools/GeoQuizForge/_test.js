
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var s=A.genSet(rngFactory(5),5,'cap');ok('len',s.length===5);
ok('struct',s[0].options.length===4 && typeof s[0].answer==='number');
var s2=A.genSet(rngFactory(5),5,'cap');ok('deterministic',JSON.stringify(s)===JSON.stringify(s2));
var q=A.pickQuiz(rngFactory(1),'cap',A.COUNTRIES[0]);ok('answer valid',q.answer>=0&&q.answer<4);
console.log('GeoQuizForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
