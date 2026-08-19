
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var sp40=A.stagePlan(40), sp90=A.stagePlan(90);
ok('stage40', sp40.length===5 && sp40[0][0]==='导入');
ok('stage90', sp90.length===5 && sp90[1][1]===35);
var a=A.buildLessonPlan({subject:'数学',grade:'初中',minutes:40,topic:'一元二次方程',goals:'理解定义\n掌握配方法',key:'配方法',diff:'常数处理'});
ok('full', a.markdown.indexOf('教案')>=0 && a.markdown.indexOf('一元二次方程')>=0 && a.markdown.indexOf('配方法')>=0 && a.goalCount===2 && a.stageCount===5);
ok('sections', a.markdown.indexOf('教学目标')>=0 && a.markdown.indexOf('教学过程')>=0 && a.markdown.indexOf('板书设计')>=0 && a.markdown.indexOf('教学反思')>=0);
ok('minutes40', a.markdown.indexOf('40 分钟')>=0 && a.minutes===40);
var b=A.buildLessonPlan({});
ok('empty', b.markdown.indexOf('（待填写课题）')>=0 && b.markdown.indexOf('（待补充教学目标）')>=0 && b.goalCount===1);
var c=A.buildLessonPlan({subject:'语文',minutes:90,topic:'背影',goals:'体会父爱'});
ok('long90', c.minutes===90 && c.markdown.indexOf('90 分钟')>=0 && c.markdown.indexOf('实践练习')>=0);
console.log('LessonPlanForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
