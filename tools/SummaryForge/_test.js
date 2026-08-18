
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('empty', !!A.summarize('','').error);
var r=A.summarize('今天天气好。我们去公园。公园里有很多树。树上有鸟。鸟在唱歌。',0.5);
ok('summary', typeof r.summary==='string' && r.summary.length>0);
ok('count', r.count>=1 && r.count<=3);
ok('ratio', A.summarize('a. b. c. d. e.',1).count===5);
console.log('SummaryForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
