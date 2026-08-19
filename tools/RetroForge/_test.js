
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var f3=A.frameOf('Start/Stop/Continue'), f4=A.frameOf('4L'), fm=A.frameOf('Mad/Sad/Glad');
ok('frames', f3.cols.length===3 && f4.cols.length===4 && fm.cols.length===3 && f4.cols[0]==='Liked（喜欢）');
var ag=A.buildAgenda(60);
ok('agenda', ag.length===5 && ag[0][1]===5 && ag[1][1]>=10 && ag[2][1]>=15);
ok('agendamin', A.buildAgenda(90)[2][1] > A.buildAgenda(60)[2][1]);
var a=A.buildRetro({sprint:'Sprint 23',format:'4L',minutes:90,size:6});
ok('full', a.colCount===4 && a.agendaCount===5 && a.markdown.indexOf('Sprint 23')>=0 && a.markdown.indexOf('议程')>=0);
ok('cols', a.markdown.indexOf('Longed for（期望）')>=0 && a.markdown.indexOf('Liked（喜欢）')>=0);
ok('action', a.markdown.indexOf('行动项')>=0 && a.markdown.indexOf('| 行动项 | 负责人 | 验收标准 | 截止日期 |')>=0);
var b=A.buildRetro({sprint:'',format:'Start/Stop/Continue',minutes:60});
ok('empty', b.title.indexOf('本迭代')>=0 && b.colCount===3 && b.markdown.indexOf('开始做')>=0);
ok('agendaSum', a.agendaMinutes>=45);
console.log('RetroForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
