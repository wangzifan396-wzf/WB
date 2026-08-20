
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var d=A.parseDim('内容:4\n结构:3\n语言:2');
ok('dim', d.length===3 && d[0].k==='内容' && d[0].w===4 && d[1].w===3 && d[2].w===2);
var a=A.buildRubric({task:'记叙文写作',dimensions:'内容:4\n结构:3\n语言:2\n书写:1',levels:'优秀\n良好\n合格\n不合格'});
ok('full', a.dimCount===4 && a.levelCount===4 && a.weightSum===10 && a.title.indexOf('记叙文写作')>=0);
ok('table', a.markdown.indexOf('| 维度 | 权重 | 优秀 | 良好 | 合格 | 不合格 |')>=0 && a.markdown.indexOf('| --- | --- |')>=0);
ok('rows', a.markdown.indexOf('| 内容 | 4 |')>=0 && a.markdown.indexOf('| 书写 | 1 |')>=0 && a.markdown.indexOf('示范级')>=0 && a.markdown.indexOf('需重点改进')>=0);
ok('weights', a.markdown.indexOf('内容 40%')>=0 && a.markdown.indexOf('书写 10%')>=0 && a.markdown.indexOf('合计 100%')>=0);
var b=A.buildRubric({});
ok('empty', b.dimCount===1 && b.levelCount===4 && b.weightSum===1 && b.markdown.indexOf('（待填写评价任务）')>=0 && b.markdown.indexOf('| 内容 | 1 |')>=0);
console.log('GradingRubricForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
