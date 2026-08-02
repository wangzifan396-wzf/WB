
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
const mod={exports:{}};
new Function('module','exports','require',m[1])(mod,mod.exports,require);
const P=mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }
const a=P.expenseParseEntry('50 餐饮');
ok(a.amount===50 && a.cat==='餐饮' && a.date==='' ,'space parse');
const b=P.expenseParseEntry('50,餐饮,2026-07-30,午饭');
ok(b.amount===50 && b.cat==='餐饮' && b.date==='2026-07-30' && b.note==='午饭','comma parse');
ok(P.expenseParseEntry('abc').error!==null,'bad amount');
var list=[{amount:50,cat:'餐饮',date:'2026-07-30'},{amount:30,cat:'餐饮',date:'2026-07-30'},{amount:100,cat:'交通',date:'2026-06-15'}];
var s=P.expenseSummary(list);
ok(s.total===180,'total');
ok(s.byCat['餐饮']===80 && s.byCat['交通']===100,'byCat');
ok(s.byMonth['2026-07']===80 && s.byMonth['2026-06']===100,'byMonth');
ok(P.expenseSummary([{amount:12.5,cat:'a',date:'2026-01-01'},{amount:7.5,cat:'a',date:'2026-01-02'}]).total===20,'decimal total');
console.log('PASS '+n+' assertions');
