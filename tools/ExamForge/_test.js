
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var ps=A.parseSections('简答题:2:5');
ok('parse', ps.length===1 && ps[0].type==='简答题' && ps[0].count===2 && ps[0].points===5);
var a=A.buildExam({subject:'数学',grade:'初中',duration:90,topic:'期末复习',sections:'选择题:10:2\n填空题:5:3\n简答题:3:10'});
ok('full', a.sectionCount===3 && a.questionCount===18 && a.totalPoints===65 && a.duration===90);
ok('parts', a.markdown.indexOf('第 1 部分　选择题')>=0 && a.markdown.indexOf('每题 2 分')>=0 && a.markdown.indexOf('总分：65 分')>=0);
ok('grade', a.markdown.indexOf('初中')>=0 && a.markdown.indexOf('90 分钟')>=0);
var b=A.buildExam({duration:5,sections:'论述题:1:20'});
ok('clamp', b.duration===10 && b.questionCount===1 && b.totalPoints===20 && b.markdown.indexOf('第 1 部分　论述题')>=0);
var c=A.buildExam({});
ok('empty', c.markdown.indexOf('（待填写试卷主题）')>=0 && c.sectionCount===3 && c.totalPoints===65);
console.log('ExamForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
