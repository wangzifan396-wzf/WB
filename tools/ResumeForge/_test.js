
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r=A.build({name:'李四', title:'前端', email:'a@b.c', skills:['JS'], experience:[{role:'dev',org:'C',period:'2020-2023'}], education:[{degree:'学士',school:'Y',year:'2016'}]});
ok('contains name', r.indexOf('李四')>=0);
ok('contains 技能', r.indexOf('## 技能')>=0);
ok('contains 经历', r.indexOf('## 经历')>=0);
ok('contains 教育', r.indexOf('## 教育')>=0);
console.log('ResumeForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
