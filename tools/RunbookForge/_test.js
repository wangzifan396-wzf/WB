
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var s0=A.sla('P0'), s1=A.sla('P1'), s2=A.sla('P2');
ok('sla', s0.respond===5 && s0.mitigate===30 && s1.respond===15 && s1.mitigate===120 && s2.respond===60 && s2.mitigate===1440);
var a=A.buildRunbook({service:'order-api',level:'P0',scenes:'5xx 错误率升高\n回调延迟升高',contact:'值班群'});
ok('full', a.respondMinutes===5 && a.mitigateMinutes===30 && a.sceneCount===2);
ok('sections', a.markdown.indexOf('响应目标')>=0 && a.markdown.indexOf('响应流程')>=0 && a.markdown.indexOf('场景处置手册')>=0 && a.markdown.indexOf('升级路径')>=0 && a.markdown.indexOf('复盘要求')>=0);
ok('scenes', a.markdown.indexOf('场景 1：5xx 错误率升高')>=0 && a.markdown.indexOf('场景 2：回调延迟升高')>=0);
ok('contact', a.markdown.indexOf('值班群')>=0);
var b=A.buildRunbook({});
ok('empty', b.markdown.indexOf('（待填写服务名）')>=0 && b.sceneCount===2 && b.respondMinutes===15);
ok('steps', b.markdown.indexOf('确认告警真实性')>=0 && b.markdown.indexOf('回滚最近变更')>=0);
console.log('RunbookForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
