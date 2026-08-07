
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var a=A.sign('1990-08-15');
ok('leo', a.sign==='狮子座' && a.element==='火');
ok('capricorn jan', A.sign('1990-01-15').sign==='摩羯座');
ok('gemini', A.sign('1990-06-01').sign==='双子座');
ok('invalid null', A.sign('bad')===null);
console.log('AstrologyForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
