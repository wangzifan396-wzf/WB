
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var good=A.score('你是老师，请生成一份数学练习题，用表格输出');
ok('high',good.score>=95 && good.suggestions.length===0);
var bad=A.score('写点东西');
ok('low',bad.score<40 && bad.suggestions.length>0);
ok('mid',A.score('请总结这篇文章').score>=20);
console.log('PromptScoreForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
