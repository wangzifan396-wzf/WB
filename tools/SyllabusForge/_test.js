
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var wt=A.weekThemes(16,['A','B','C']);
ok('weeks16', wt.length===16 && wt[0]==='绪论与课程导学' && wt[13]==='综合复习与答疑' && wt[14]==='期末考核' && wt[15]==='机动与补遗');
ok('rotations', wt[1]==='A' && wt[2]==='B' && wt[3]==='C' && wt[4]==='A');
var ap=A.assessPlan('项目为主');
ok('assess', ap.length===3 && ap[2][0]==='项目答辩' && ap[2][1]===50);
var a=A.buildSyllabus({name:'信息技术',weeks:16,perWeek:2,goals:'计算思维\n办公应用',mode:'考试为主'});
ok('full', a.weekCount===16 && a.totalHours===32 && a.markdown.indexOf('16 周')>=0 && a.markdown.indexOf('32 学时')>=0 && a.markdown.indexOf('期末考试：50%')>=0);
ok('header', a.markdown.indexOf('课程大纲')>=0 && a.markdown.indexOf('周次安排')>=0 && a.markdown.indexOf('考核构成')>=0);
var b=A.buildSyllabus({});
ok('empty', b.markdown.indexOf('（待填写课程名）')>=0 && b.markdown.indexOf('（待补充课程目标）')>=0);
var c=A.buildSyllabus({name:'X',weeks:99,perWeek:9,goals:'g'});
ok('clamp', c.weekCount===24 && c.totalHours===192);
console.log('SyllabusForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
