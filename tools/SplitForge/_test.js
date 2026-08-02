
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
const mod={exports:{}};
new Function('module','exports','require',m[1])(mod,mod.exports,require);
const P=mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }
const close=function(a,b,e){ return Math.abs(a-b)<(e||1e-6); };
const pi=P.splitParseItems('火锅 328\n饮料 66\n小吃 42');
ok(pi.error===null && pi.items.length===3,'parse 3 items');
ok(P.splitParseItems('abc def').error!==null,'bad amount');
const a=P.splitCompute(pi.items,{people:3,tipPct:10,taxPct:0,discountPct:0});
ok(close(a.subtotal,436),'subtotal');
ok(close(a.tip,43.6),'tip');
ok(close(a.grand,479.6),'grand');
ok(Math.abs(a.perPerson-479.6/3)<0.01,'perPerson');
const b=P.splitCompute(pi.items,{people:4,tipPct:0,taxPct:0,discountPct:20});
ok(close(b.discount,87.2),'discount');
ok(close(b.grand,348.8),'grand after discount');
ok(close(b.perPerson,87.2),'perPerson after discount');
ok(P.splitCompute(pi.items,{people:0}).error!==null,'people invalid');
console.log('PASS '+n+' assertions');
