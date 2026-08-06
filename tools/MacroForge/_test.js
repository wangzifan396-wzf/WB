
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
function near(a,b,t){return Math.abs(a-b)<=(t||5e-2);}
var b=A.macro(2000,'balanced');
ok('bal carb',   near(b.carb, 250));
ok('bal protein',near(b.protein, 100));
ok('bal fat',    near(b.fat, 66.67, 0.1));
var k=A.macro(2000,'keto');
ok('keto carb',  near(k.carb, 25));
ok('keto fat',   near(k.fat, 166.67, 0.1));
console.log('MacroForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
