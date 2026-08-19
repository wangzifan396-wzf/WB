
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var a=A.buildPlan({goal:'减脂',kcal:1800,meals:3,days:7});
ok('days7', a.dayCount===7 && a.mealCount===3 && a.markdown.indexOf('1800')>=0 && a.markdown.indexOf('膳食计划')>=0);
ok('rows', a.markdown.split('| 周').length-1===7);
var b=A.buildPlan({meals:5});
ok('meals5', b.mealCount===5 && b.markdown.indexOf('加餐')>=0);
var c=A.buildPlan({});
ok('default', c.dayCount===7 && c.mealCount===3);
ok('mealsOf', A.mealsOf(4).length===4 && A.mealsOf(3)[0]==='早餐');
console.log('MealPlanForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
