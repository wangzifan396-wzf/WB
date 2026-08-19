
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r=A.parseExpenses('12.5 午餐\n45 出租车');
ok('cnt', r.items.length===2);
ok('amt', r.items[0].amount===12.5 && r.items[1].amount===45);
ok('cat', r.items[0].category==='餐饮' && r.items[1].category==='交通');
var s=A.summarize('12.5 午餐\n45 出租车\n200 酒店住宿');
ok('total', Math.abs(s.total-257.5)<1e-9);
ok('cat2', Math.abs(s.byCategory['住宿']-200)<1e-9);
ok('report', s.report.indexOf('报销报告')>=0 && s.report.indexOf('¥257.50')>=0);
ok('yuan', A.parseAmount('¥1,234.5')===1234.5);
console.log('ExpenseReportForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
