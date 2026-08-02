
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
const mod={exports:{}};
new Function('module','exports','require',m[1])(mod,mod.exports,require);
const P=mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }
var a=P.calParse('燕麦 300 p20 c50 f6');
ok(a.name==='燕麦' && a.kcal===300 && a.protein===20 && a.carbs===50 && a.fat===6,'parse full');
var b=P.calParse('苹果 95');
ok(b.name==='苹果' && b.kcal===95 && b.protein===0,'parse simple');
ok(P.calParse('no number here').error!==null,'bad parse');
var s=P.calSummary([{kcal:100,protein:5,carbs:10,fat:2},{kcal:200,protein:10,carbs:20,fat:4}]);
ok(s.kcal===300 && s.protein===15 && s.carbs===30 && s.fat===6,'summary');
console.log('PASS '+n+' assertions');
