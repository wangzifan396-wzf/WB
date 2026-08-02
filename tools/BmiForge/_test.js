
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
const mod={exports:{}};
new Function('module','exports','require',m[1])(mod,mod.exports,require);
const P=mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }
const close=function(a,b,e){ return Math.abs(a-b)<(e||1e-6); };
const a=P.bmiCompute(70,175);
ok(a.error===null && a.category==='正常','normal');
ok(close(a.bmi,22.9,0.01),'bmi value');
ok(close(a.healthyLow,56.7,0.01),'healthy low');
ok(close(a.healthyHigh,73.2,0.01),'healthy high');
ok(P.bmiCompute(50,175).category==='偏瘦','underweight');
ok(P.bmiCompute(95,170).category==='肥胖','obese');
ok(P.bmiCompute(82,175).category==='超重','overweight');
ok(P.bmiCompute(-5,175).error!==null,'neg weight');
const bf=P.bmiBodyFat(22.857,30,1);
ok(bf.error===null && close(bf.bodyFat,18.1,0.2),'body fat male');
const bf2=P.bmiBodyFat(22.857,30,0);
ok(bf2.bodyFat>bf.bodyFat,'female higher bf');
ok(P.bmiBodyFat(22,0,1).error!==null,'age invalid');
console.log('PASS '+n+' assertions');
