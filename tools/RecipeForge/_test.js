
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
const mod={exports:{}};
new Function('module','exports','require',m[1])(mod,mod.exports,require);
const P=mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }
const a=P.recipeParseLine('200 g 面粉');
ok(a.amount===200 && a.unit==='g' && a.name==='面粉','parse with unit');
const b=P.recipeParseLine('2 鸡蛋');
ok(b.amount===2 && b.name==='鸡蛋','parse no unit');
const c=P.recipeParseLine('盐 适量');
ok(c.amount===null && c.name==='盐 适量','parse no amount');
const items=P.recipeParse('200 g 面粉\n100 g 糖\n2 鸡蛋');
ok(items.length===3,'parse 3');
const s=P.recipeScale(items,2);
ok(s[0].amount===400 && s[1].amount===200 && s[2].amount===4,'double scale');
const s2=P.recipeScale(items,0.5);
ok(s2[0].amount===100,'half scale');
ok(P.recipeRender(items).indexOf('面粉')>0,'render');
console.log('PASS '+n+' assertions');
