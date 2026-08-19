
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var a=A.buildPlan({goal:'增肌',days:4,level:'初级',equip:'哑铃'});
ok('days4', a.dayCount===4 && a.markdown.indexOf('增肌')>=0 && a.markdown.indexOf('哑铃')>=0);
var b=A.buildPlan({goal:'减脂',days:3,level:'初级',equip:'徒手'});
ok('days3', b.dayCount===3 && b.markdown.indexOf('徒手')>=0 && b.markdown.indexOf('全身')>=0);
var c=A.buildPlan({goal:'维持',days:5,level:'中级',equip:'健身房'});
ok('days5', c.dayCount===5 && c.markdown.indexOf('健身房')>=0);
// 每个训练日都有动作
var secs=a.markdown.split('## 第');
ok('exercises', secs.length===5 && secs[1].indexOf('- ')>=0);
var d=A.buildPlan({});
ok('default', d.dayCount>=3 && d.markdown.indexOf('维持')>=0);
ok('normalize', A.normalizeEquip('健身房器械')==='健身房');
console.log('WorkoutForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
