
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
const mod={exports:{}};
new Function('module','exports','require',m[1])(mod,mod.exports,require);
const P=mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }
ok(P.ageDays('2020-01-01','2020-01-02')===1,'one day');
var d=P.ageDiff('2020-01-01','2021-03-05');
ok(d.years===1 && d.months===2 && d.days===4,'diff y/m/d');
var d2=P.ageDiff('2020-01-15','2022-06-20');
ok(d2.years===2 && d2.months===5 && d2.days===5,'diff2');
ok(P.ageParse('2020-13-01').error!==null,'bad month');
ok(P.ageDiff('2021-01-01','2020-01-01').error!==null,'end before start');
ok(P.ageDiff('2020-01-01','2020-01-01').totalDays===0,'same day');
console.log('PASS '+n+' assertions');
