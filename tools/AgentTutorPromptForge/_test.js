
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var a=A.buildTutorPrompt({subject:'物理',topic:'牛顿第二定律',goal:'理解 F=ma 并能套用',level:'beginner',style:'socratic',lang:'中文',examples:'小车实验'});
ok('full', a.level==='初学者' && a.style==='苏格拉底式提问' && a.hasGoal===true && a.title.indexOf('物理')>=0 && a.markdown.indexOf('辅导 Agent 角色卡')>=0 && a.markdown.indexOf('F=ma')>=0 && a.markdown.indexOf('不直接给最终答案')>=0 && a.markdown.indexOf('参考样例')>=0 && a.markdown.indexOf('小车实验')>=0);
var b=A.buildTutorPrompt({level:'expert',style:'direct'});
ok('levelstyle', b.level==='专家' && b.style==='直接讲解' && b.hasGoal===false && b.markdown.indexOf('（待填写学科）')>=0 && b.markdown.indexOf('用中文与学生交流')>=0);
console.log('AgentTutorPromptForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
